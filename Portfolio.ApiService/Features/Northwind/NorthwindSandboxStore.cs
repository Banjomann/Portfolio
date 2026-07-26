using System.Collections.Concurrent;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Portfolio.ApiService.Data;

namespace Portfolio.ApiService.Features.Northwind;

public sealed class NorthwindSandboxStore : IAsyncDisposable
{
    private readonly ConcurrentDictionary<string, Lazy<Task<SandboxSession>>> sessions = [];

    public async Task<SandboxSession> GetAsync(
        string sessionId,
        NorthwindDbContext canonicalDatabase,
        CancellationToken cancellationToken)
    {
        var session = sessions.GetOrAdd(
            sessionId,
            _ => new(() => CreateSessionAsync(canonicalDatabase, cancellationToken)));

        try
        {
            return await session.Value;
        }
        catch
        {
            sessions.TryRemove(sessionId, out _);
            throw;
        }
    }

    public async Task ResetAsync(string sessionId)
    {
        if (sessions.TryRemove(sessionId, out var session) &&
            session.IsValueCreated)
        {
            await (await session.Value).DisposeAsync();
        }
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var session in sessions.Values.Where(session => session.IsValueCreated))
        {
            await (await session.Value).DisposeAsync();
        }
    }

    private static async Task<SandboxSession> CreateSessionAsync(
        NorthwindDbContext canonicalDatabase,
        CancellationToken cancellationToken)
    {
        var customers = await canonicalDatabase.Customers
            .AsNoTracking()
            .Select(customer => new SandboxCustomer
            {
                CustomerId = customer.CustomerId,
                CompanyName = customer.CompanyName,
                ContactName = customer.ContactName,
                ContactTitle = customer.ContactTitle,
                Address = customer.Address,
                City = customer.City,
                Region = customer.Region,
                PostalCode = customer.PostalCode,
                Country = customer.Country,
                Phone = customer.Phone,
                Fax = customer.Fax,
            })
            .ToListAsync(cancellationToken);

        var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync(cancellationToken);
        var session = new SandboxSession(connection);

        await using var sandboxDatabase = session.CreateContext();
        await sandboxDatabase.Database.EnsureCreatedAsync(cancellationToken);
        sandboxDatabase.Customers.AddRange(customers);
        await sandboxDatabase.SaveChangesAsync(cancellationToken);

        return session;
    }
}

public sealed class SandboxSession(SqliteConnection connection) : IAsyncDisposable
{
    private readonly DbContextOptions<SandboxDbContext> options =
        new DbContextOptionsBuilder<SandboxDbContext>()
            .UseSqlite(connection)
            .Options;

    public SemaphoreSlim Gate { get; } = new(1, 1);

    public SandboxDbContext CreateContext() => new(options);

    public async ValueTask DisposeAsync()
    {
        Gate.Dispose();
        await connection.DisposeAsync();
    }
}

public sealed class SandboxDbContext(DbContextOptions<SandboxDbContext> options)
    : DbContext(options)
{
    public DbSet<SandboxCustomer> Customers => Set<SandboxCustomer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SandboxCustomer>()
            .HasKey(customer => customer.CustomerId);
    }
}

public sealed class SandboxCustomer
{
    public required string CustomerId { get; set; }
    public required string CompanyName { get; set; }
    public string? ContactName { get; set; }
    public string? ContactTitle { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? Phone { get; set; }
    public string? Fax { get; set; }
}
