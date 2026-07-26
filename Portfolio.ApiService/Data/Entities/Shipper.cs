namespace Portfolio.ApiService.Data.Entities;

public sealed class Shipper
{
    public int ShipperId { get; set; }

    public required string CompanyName { get; set; }

    public string? Phone { get; set; }

    public ICollection<Order> Orders { get; set; } = [];
}
