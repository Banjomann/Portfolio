using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Portfolio.ApiService.Data;
using Portfolio.ApiService.Data.Entities;

namespace Portfolio.ApiService.Features.Northwind;

public static class NorthwindEndpointExtensions
{
    private const int DefaultPageSize = 10;
    private const int MaximumPageSize = 50;

    public static IEndpointRouteBuilder MapNorthwindEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/northwind")
            .WithTags("Northwind");

        group.MapGet("/countries", GetCountries)
            .WithName("GetNorthwindCountries");
        group.MapGet("/customers", GetCustomers)
            .WithName("GetNorthwindCustomers");
        group.MapGet("/customers/{customerId}", GetCustomer)
            .WithName("GetNorthwindCustomer");
        group.MapGet("/customers/{customerId}/orders", GetCustomerOrders)
            .WithName("GetNorthwindCustomerOrders");
        group.MapGet("/orders/{orderId:int}", GetOrder)
            .WithName("GetNorthwindOrder");

        return endpoints;
    }

    private static async Task<Ok<IReadOnlyList<string>>> GetCountries(
        NorthwindDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var countries = await dbContext.Customers
            .AsNoTracking()
            .Where(customer => customer.Country != null)
            .Select(customer => customer.Country!)
            .Distinct()
            .OrderBy(country => country)
            .ToListAsync(cancellationToken);

        return TypedResults.Ok<IReadOnlyList<string>>(countries);
    }

    private static async Task<Results<Ok<PagedResult<CustomerListItem>>, ValidationProblem>> GetCustomers(
        NorthwindDbContext dbContext,
        string? search,
        string? country,
        string? sort,
        string? direction,
        int page = 1,
        int pageSize = DefaultPageSize,
        CancellationToken cancellationToken = default)
    {
        var validationErrors = ValidateGridQuery(sort, direction, page, pageSize);

        if (validationErrors.Count > 0)
        {
            return TypedResults.ValidationProblem(validationErrors);
        }

        var query = dbContext.Customers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim();
            query = query.Where(customer =>
                customer.CompanyName.Contains(searchTerm) ||
                (customer.ContactName != null && customer.ContactName.Contains(searchTerm)));
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            var countryFilter = country.Trim();
            query = query.Where(customer => customer.Country == countryFilter);
        }

        query = ApplyCustomerSort(query, sort, direction);

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

    private static async Task<Results<Ok<CustomerDetail>, NotFound>> GetCustomer(
        NorthwindDbContext dbContext,
        string customerId,
        CancellationToken cancellationToken)
    {
        var customer = await dbContext.Customers
            .AsNoTracking()
            .Where(candidate => candidate.CustomerId == customerId)
            .Select(candidate => new CustomerDetail(
                candidate.CustomerId,
                candidate.CompanyName,
                candidate.ContactName,
                candidate.ContactTitle,
                candidate.Address,
                candidate.City,
                candidate.Region,
                candidate.PostalCode,
                candidate.Country,
                candidate.Phone,
                candidate.Fax,
                candidate.Orders.Count,
                candidate.Orders
                    .SelectMany(order => order.OrderDetails)
                    .Sum(detail =>
                        detail.UnitPrice *
                        detail.Quantity *
                        (1 - (decimal)detail.Discount)),
                candidate.Orders.Max(order => order.OrderDate)))
            .SingleOrDefaultAsync(cancellationToken);

        return customer is null
            ? TypedResults.NotFound()
            : TypedResults.Ok(customer);
    }

    private static async Task<Results<Ok<IReadOnlyList<CustomerOrder>>, NotFound>> GetCustomerOrders(
        NorthwindDbContext dbContext,
        string customerId,
        CancellationToken cancellationToken)
    {
        var customerExists = await dbContext.Customers
            .AsNoTracking()
            .AnyAsync(customer => customer.CustomerId == customerId, cancellationToken);

        if (!customerExists)
        {
            return TypedResults.NotFound();
        }

        var orders = await dbContext.Orders
            .AsNoTracking()
            .Where(order => order.CustomerId == customerId)
            .OrderByDescending(order => order.OrderDate)
            .ThenByDescending(order => order.OrderId)
            .Select(order => new CustomerOrder(
                order.OrderId,
                order.OrderDate,
                order.RequiredDate,
                order.ShippedDate,
                order.ShippedDate != null
                    ? "Shipped"
                    : order.RequiredDate < DateTime.UtcNow
                        ? "Overdue"
                        : "Processing",
                order.Employee == null
                    ? null
                    : order.Employee.FirstName + " " + order.Employee.LastName,
                order.Shipper == null ? null : order.Shipper.CompanyName,
                order.ShipCity,
                order.ShipCountry,
                order.Freight ?? 0,
                order.OrderDetails.Sum(detail =>
                    detail.UnitPrice *
                    detail.Quantity *
                    (1 - (decimal)detail.Discount))))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok<IReadOnlyList<CustomerOrder>>(orders);
    }

    private static async Task<Results<Ok<OrderDetail>, NotFound>> GetOrder(
        NorthwindDbContext dbContext,
        int orderId,
        CancellationToken cancellationToken)
    {
        var order = await dbContext.Orders
            .AsNoTracking()
            .Include(candidate => candidate.Customer)
            .Include(candidate => candidate.Employee)
            .Include(candidate => candidate.Shipper)
            .Include(candidate => candidate.OrderDetails)
                .ThenInclude(detail => detail.Product)
            .SingleOrDefaultAsync(candidate => candidate.OrderId == orderId, cancellationToken);

        if (order?.Customer is null)
        {
            return TypedResults.NotFound();
        }

        var items = order.OrderDetails
            .OrderBy(detail => detail.Product?.ProductName)
            .Select(detail => new OrderLineItem(
                detail.ProductId,
                detail.Product?.ProductName ?? "Unknown product",
                detail.UnitPrice,
                detail.Quantity,
                detail.Discount,
                detail.UnitPrice * detail.Quantity * (1 - (decimal)detail.Discount)))
            .ToList();
        var subtotal = items.Sum(item => item.ExtendedPrice);
        var freight = order.Freight ?? 0;

        return TypedResults.Ok(new OrderDetail(
            order.OrderId,
            order.Customer.CustomerId,
            order.Customer.CompanyName,
            order.OrderDate,
            order.RequiredDate,
            order.ShippedDate,
            GetOrderStatus(order),
            order.Employee is null
                ? null
                : $"{order.Employee.FirstName} {order.Employee.LastName}",
            order.Shipper?.CompanyName,
            freight,
            new ShippingAddress(
                order.ShipName,
                order.ShipAddress,
                order.ShipCity,
                order.ShipRegion,
                order.ShipPostalCode,
                order.ShipCountry),
            items,
            subtotal,
            subtotal + freight));
    }

    private static Dictionary<string, string[]> ValidateGridQuery(
        string? sort,
        string? direction,
        int page,
        int pageSize)
    {
        var errors = new Dictionary<string, string[]>();
        var validSorts = new[] { "customerId", "companyName", "contactName", "city", "country" };

        if (!string.IsNullOrWhiteSpace(sort) &&
            !validSorts.Contains(sort, StringComparer.OrdinalIgnoreCase))
        {
            errors["sort"] = [$"Sort must be one of: {string.Join(", ", validSorts)}."];
        }

        if (!string.IsNullOrWhiteSpace(direction) &&
            !direction.Equals("asc", StringComparison.OrdinalIgnoreCase) &&
            !direction.Equals("desc", StringComparison.OrdinalIgnoreCase))
        {
            errors["direction"] = ["Direction must be either 'asc' or 'desc'."];
        }

        if (page < 1)
        {
            errors["page"] = ["Page must be at least 1."];
        }

        if (pageSize is < 1 or > MaximumPageSize)
        {
            errors["pageSize"] = [$"Page size must be between 1 and {MaximumPageSize}."];
        }

        return errors;
    }

    private static IQueryable<Customer> ApplyCustomerSort(
        IQueryable<Customer> query,
        string? sort,
        string? direction)
    {
        var descending = direction?.Equals(
            "desc",
            StringComparison.OrdinalIgnoreCase) == true;

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

    private static string GetOrderStatus(Order order)
    {
        if (order.ShippedDate is not null)
        {
            return "Shipped";
        }

        return order.RequiredDate < DateTime.UtcNow
            ? "Overdue"
            : "Processing";
    }
}
