namespace Portfolio.ApiService.Data.Entities;

public sealed class Product
{
    public int ProductId { get; set; }

    public required string ProductName { get; set; }

    public decimal? UnitPrice { get; set; }

    public ICollection<OrderDetail> OrderDetails { get; set; } = [];
}
