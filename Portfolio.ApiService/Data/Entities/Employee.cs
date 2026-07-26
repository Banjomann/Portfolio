namespace Portfolio.ApiService.Data.Entities;

public sealed class Employee
{
    public int EmployeeId { get; set; }

    public required string LastName { get; set; }

    public required string FirstName { get; set; }

    public ICollection<Order> Orders { get; set; } = [];
}
