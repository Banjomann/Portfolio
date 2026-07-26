namespace Portfolio.ApiService.Features.Northwind;

public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);

public sealed record CustomerListItem(
    string CustomerId,
    string CompanyName,
    string? ContactName,
    string? ContactTitle,
    string? City,
    string? Country,
    string? Phone);

public sealed record CustomerDetail(
    string CustomerId,
    string CompanyName,
    string? ContactName,
    string? ContactTitle,
    string? Address,
    string? City,
    string? Region,
    string? PostalCode,
    string? Country,
    string? Phone,
    string? Fax,
    int OrderCount,
    decimal TotalSales,
    DateTime? LastOrderDate);

public sealed record SandboxCustomerUpdate(
    string CompanyName,
    string? ContactName,
    string? ContactTitle,
    string? Address,
    string? City,
    string? Region,
    string? PostalCode,
    string? Country,
    string? Phone,
    string? Fax);

public sealed record CustomerOrder(
    int OrderId,
    DateTime? OrderDate,
    DateTime? RequiredDate,
    DateTime? ShippedDate,
    string Status,
    string? EmployeeName,
    string? ShipperName,
    string? ShipCity,
    string? ShipCountry,
    decimal Freight,
    decimal Total);

public sealed record OrderDetail(
    int OrderId,
    string CustomerId,
    string CompanyName,
    DateTime? OrderDate,
    DateTime? RequiredDate,
    DateTime? ShippedDate,
    string Status,
    string? EmployeeName,
    string? ShipperName,
    decimal Freight,
    ShippingAddress ShippingAddress,
    IReadOnlyList<OrderLineItem> Items,
    decimal Subtotal,
    decimal Total);

public sealed record ShippingAddress(
    string? Name,
    string? Address,
    string? City,
    string? Region,
    string? PostalCode,
    string? Country);

public sealed record OrderLineItem(
    int ProductId,
    string ProductName,
    decimal UnitPrice,
    short Quantity,
    float Discount,
    decimal ExtendedPrice);
