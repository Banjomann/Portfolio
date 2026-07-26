using Microsoft.EntityFrameworkCore;
using Portfolio.ApiService.Data.Entities;

namespace Portfolio.ApiService.Data;

public sealed class NorthwindDbContext(DbContextOptions<NorthwindDbContext> options) : DbContext(options)
{
    public DbSet<Customer> Customers => Set<Customer>();

    public DbSet<Employee> Employees => Set<Employee>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<Shipper> Shippers => Set<Shipper>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.HasKey(customer => customer.CustomerId);
            entity.Property(customer => customer.CustomerId)
                .HasColumnName("CustomerID")
                .HasMaxLength(5)
                .IsFixedLength();
            entity.Property(customer => customer.CompanyName).HasMaxLength(40);
            entity.Property(customer => customer.ContactName).HasMaxLength(30);
            entity.Property(customer => customer.ContactTitle).HasMaxLength(30);
            entity.Property(customer => customer.Address).HasMaxLength(60);
            entity.Property(customer => customer.City).HasMaxLength(15);
            entity.Property(customer => customer.Region).HasMaxLength(15);
            entity.Property(customer => customer.PostalCode).HasMaxLength(10);
            entity.Property(customer => customer.Country).HasMaxLength(15);
            entity.Property(customer => customer.Phone).HasMaxLength(24);
            entity.Property(customer => customer.Fax).HasMaxLength(24);
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.ToTable("Employees");
            entity.HasKey(employee => employee.EmployeeId);
            entity.Property(employee => employee.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(employee => employee.FirstName).HasMaxLength(10);
            entity.Property(employee => employee.LastName).HasMaxLength(20);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders");
            entity.HasKey(order => order.OrderId);
            entity.Property(order => order.OrderId).HasColumnName("OrderID");
            entity.Property(order => order.CustomerId)
                .HasColumnName("CustomerID")
                .HasMaxLength(5)
                .IsFixedLength();
            entity.Property(order => order.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(order => order.ShipperId).HasColumnName("ShipVia");
            entity.Property(order => order.Freight).HasColumnType("money");
            entity.Property(order => order.ShipName).HasMaxLength(40);
            entity.Property(order => order.ShipAddress).HasMaxLength(60);
            entity.Property(order => order.ShipCity).HasMaxLength(15);
            entity.Property(order => order.ShipRegion).HasMaxLength(15);
            entity.Property(order => order.ShipPostalCode).HasMaxLength(10);
            entity.Property(order => order.ShipCountry).HasMaxLength(15);
            entity.HasOne(order => order.Customer)
                .WithMany(customer => customer.Orders)
                .HasForeignKey(order => order.CustomerId);
            entity.HasOne(order => order.Employee)
                .WithMany(employee => employee.Orders)
                .HasForeignKey(order => order.EmployeeId);
            entity.HasOne(order => order.Shipper)
                .WithMany(shipper => shipper.Orders)
                .HasForeignKey(order => order.ShipperId);
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.ToTable("Order Details");
            entity.HasKey(detail => new { detail.OrderId, detail.ProductId });
            entity.Property(detail => detail.OrderId).HasColumnName("OrderID");
            entity.Property(detail => detail.ProductId).HasColumnName("ProductID");
            entity.Property(detail => detail.UnitPrice).HasColumnType("money");
            entity.Property(detail => detail.Discount).HasColumnType("real");
            entity.HasOne(detail => detail.Order)
                .WithMany(order => order.OrderDetails)
                .HasForeignKey(detail => detail.OrderId);
            entity.HasOne(detail => detail.Product)
                .WithMany(product => product.OrderDetails)
                .HasForeignKey(detail => detail.ProductId);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(product => product.ProductId);
            entity.Property(product => product.ProductId).HasColumnName("ProductID");
            entity.Property(product => product.ProductName).HasMaxLength(40);
            entity.Property(product => product.UnitPrice).HasColumnType("money");
        });

        modelBuilder.Entity<Shipper>(entity =>
        {
            entity.ToTable("Shippers");
            entity.HasKey(shipper => shipper.ShipperId);
            entity.Property(shipper => shipper.ShipperId).HasColumnName("ShipperID");
            entity.Property(shipper => shipper.CompanyName).HasMaxLength(40);
            entity.Property(shipper => shipper.Phone).HasMaxLength(24);
        });
    }
}
