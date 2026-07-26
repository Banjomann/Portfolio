using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.ApiService.Data;

namespace Portfolio.ApiService.Features.Northwind;

public static class NorthwindSandboxEndpointExtensions
{
    private const string SessionHeader = "X-Northwind-Sandbox-Session";

    public static IEndpointRouteBuilder MapNorthwindSandboxEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/northwind/sandbox")
            .WithTags("Northwind Sandbox");

        group.MapGet("/customers", GetCustomers);
        group.MapGet("/customers/{customerId}", GetCustomer);
        group.MapPut("/customers/{customerId}", UpdateCustomer);
        group.MapPost("/reset", Reset);

        return endpoints;
    }

    private static async Task<IResult> GetCustomers(
        HttpContext httpContext,
        NorthwindDbContext canonicalDatabase,
        NorthwindSandboxStore store,
        string? search,
        string? country,
        string? sort,
        string? direction,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        if (!TryGetSessionId(httpContext, out var sessionId))
        {
            return TypedResults.BadRequest();
        }

        if (page < 1 || pageSize is < 1 or > 50)
        {
            return TypedResults.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    ["paging"] = ["Page must be at least 1 and page size must be between 1 and 50."],
                });
        }

        var session = await store.GetAsync(
            sessionId,
            canonicalDatabase,
            cancellationToken);
        await session.Gate.WaitAsync(cancellationToken);

        try
        {
            await using var database = session.CreateContext();
            var query = database.Customers.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(customer =>
                    customer.CompanyName.Contains(term) ||
                    (customer.ContactName != null && customer.ContactName.Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(country))
            {
                var countryFilter = country.Trim();
                query = query.Where(customer => customer.Country == countryFilter);
            }

            query = ApplySort(query, sort, direction);
            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(customer => new CustomerListItem(
                    customer.CustomerId,
                    customer.CompanyName,
                    customer.ContactName,
                    customer.ContactTitle,
                    customer.City,
                    customer.Country,
                    customer.Phone))
                .ToListAsync(cancellationToken);

            return TypedResults.Ok(new PagedResult<CustomerListItem>(
                items,
                page,
                pageSize,
                totalCount,
                (int)Math.Ceiling(totalCount / (double)pageSize)));
        }
        finally
        {
            session.Gate.Release();
        }
    }

    private static async Task<IResult> GetCustomer(
        HttpContext httpContext,
        NorthwindDbContext canonicalDatabase,
        NorthwindSandboxStore store,
        string customerId,
        CancellationToken cancellationToken)
    {
        if (!TryGetSessionId(httpContext, out var sessionId))
        {
            return TypedResults.BadRequest();
        }

        var session = await store.GetAsync(
            sessionId,
            canonicalDatabase,
            cancellationToken);
        await session.Gate.WaitAsync(cancellationToken);

        try
        {
            await using var database = session.CreateContext();
            var customer = await database.Customers
                .AsNoTracking()
                .SingleOrDefaultAsync(
                    candidate => candidate.CustomerId == customerId,
                    cancellationToken);

            if (customer is null)
            {
                return TypedResults.NotFound();
            }

            var metrics = await canonicalDatabase.Customers
                .AsNoTracking()
                .Where(candidate => candidate.CustomerId == customerId)
                .Select(candidate => new
                {
                    OrderCount = candidate.Orders.Count,
                    TotalSales = candidate.Orders
                        .SelectMany(order => order.OrderDetails)
                        .Sum(detail =>
                            detail.UnitPrice *
                            detail.Quantity *
                            (1 - (decimal)detail.Discount)),
                    LastOrderDate = candidate.Orders.Max(order => order.OrderDate),
                })
                .SingleAsync(cancellationToken);

            return TypedResults.Ok(ToDetail(customer, metrics.OrderCount, metrics.TotalSales, metrics.LastOrderDate));
        }
        finally
        {
            session.Gate.Release();
        }
    }

    private static async Task<IResult> UpdateCustomer(
        HttpContext httpContext,
        NorthwindDbContext canonicalDatabase,
        NorthwindSandboxStore store,
        string customerId,
        [FromBody] SandboxCustomerUpdate update,
        CancellationToken cancellationToken)
    {
        if (!TryGetSessionId(httpContext, out var sessionId))
        {
            return TypedResults.BadRequest();
        }

        if (string.IsNullOrWhiteSpace(update.CompanyName))
        {
            return TypedResults.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    ["companyName"] = ["Company name is required."],
                });
        }

        var session = await store.GetAsync(
            sessionId,
            canonicalDatabase,
            cancellationToken);
        await session.Gate.WaitAsync(cancellationToken);

        try
        {
            await using var database = session.CreateContext();
            var customer = await database.Customers
                .SingleOrDefaultAsync(
                    candidate => candidate.CustomerId == customerId,
                    cancellationToken);

            if (customer is null)
            {
                return TypedResults.NotFound();
            }

            customer.CompanyName = update.CompanyName.Trim();
            customer.ContactName = Clean(update.ContactName);
            customer.ContactTitle = Clean(update.ContactTitle);
            customer.Address = Clean(update.Address);
            customer.City = Clean(update.City);
            customer.Region = Clean(update.Region);
            customer.PostalCode = Clean(update.PostalCode);
            customer.Country = Clean(update.Country);
            customer.Phone = Clean(update.Phone);
            customer.Fax = Clean(update.Fax);
            await database.SaveChangesAsync(cancellationToken);

            return TypedResults.NoContent();
        }
        finally
        {
            session.Gate.Release();
        }
    }

    private static async Task<IResult> Reset(
        HttpContext httpContext,
        NorthwindSandboxStore store)
    {
        if (!TryGetSessionId(httpContext, out var sessionId))
        {
            return TypedResults.BadRequest();
        }

        await store.ResetAsync(sessionId);
        return TypedResults.NoContent();
    }

    private static bool TryGetSessionId(
        HttpContext httpContext,
        out string sessionId)
    {
        sessionId = httpContext.Request.Headers[SessionHeader].ToString();
        return Guid.TryParse(sessionId, out _);
    }

    private static IQueryable<SandboxCustomer> ApplySort(
        IQueryable<SandboxCustomer> query,
        string? sort,
        string? direction)
    {
        var descending = direction?.Equals("desc", StringComparison.OrdinalIgnoreCase) == true;

        return (sort?.ToLowerInvariant(), descending) switch
        {
            ("customerid", true) => query.OrderByDescending(customer => customer.CustomerId),
            ("customerid", false) => query.OrderBy(customer => customer.CustomerId),
            ("contactname", true) => query.OrderByDescending(customer => customer.ContactName),
            ("contactname", false) => query.OrderBy(customer => customer.ContactName),
            ("city", true) => query.OrderByDescending(customer => customer.City),
            ("city", false) => query.OrderBy(customer => customer.City),
            ("country", true) => query.OrderByDescending(customer => customer.Country),
            ("country", false) => query.OrderBy(customer => customer.Country),
            ("companyname", true) => query.OrderByDescending(customer => customer.CompanyName),
            _ => query.OrderBy(customer => customer.CompanyName),
        };
    }

    private static CustomerDetail ToDetail(
        SandboxCustomer customer,
        int orderCount,
        decimal totalSales,
        DateTime? lastOrderDate) =>
        new(
            customer.CustomerId,
            customer.CompanyName,
            customer.ContactName,
            customer.ContactTitle,
            customer.Address,
            customer.City,
            customer.Region,
            customer.PostalCode,
            customer.Country,
            customer.Phone,
            customer.Fax,
            orderCount,
            totalSales,
            lastOrderDate);

    private static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
