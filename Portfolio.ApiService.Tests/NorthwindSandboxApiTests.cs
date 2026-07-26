using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Portfolio.ApiService.Data;
using Portfolio.ApiService.Data.Entities;
using Portfolio.ApiService.Features.Northwind;
using Xunit;

namespace Portfolio.ApiService.Tests;

public sealed class NorthwindSandboxApiTests
{
    [Fact]
    public async Task SandboxWritesAreIsolatedBySessionAndResettable()
    {
        await using var factory = new NorthwindApiFactory();
        using var client = factory.CreateClient();
        await factory.SeedAsync();
        var sessionA = Guid.NewGuid().ToString();
        var sessionB = Guid.NewGuid().ToString();

        var canonical = await GetCustomerAsync(
            client,
            "/api/northwind/customers/ALFKI");
        Assert.Equal("Alfreds Futterkiste", canonical.CompanyName);

        using var update = new HttpRequestMessage(
            HttpMethod.Put,
            "/api/northwind/sandbox/customers/ALFKI")
        {
            Content = JsonContent.Create(new SandboxCustomerUpdate(
                "Session A Company",
                "Maria Anders",
                "Sales Representative",
                "Obere Str. 57",
                "Berlin",
                null,
                "12209",
                "Germany",
                "030-0074321",
                null)),
        };
        update.Headers.Add("X-Northwind-Sandbox-Session", sessionA);
        using var updateResponse = await client.SendAsync(update);
        updateResponse.EnsureSuccessStatusCode();

        var sessionACustomer = await GetCustomerAsync(
            client,
            "/api/northwind/sandbox/customers/ALFKI",
            sessionA);
        var unchangedCanonical = await GetCustomerAsync(
            client,
            "/api/northwind/customers/ALFKI");
        var sessionBCustomer = await GetCustomerAsync(
            client,
            "/api/northwind/sandbox/customers/ALFKI",
            sessionB);

        Assert.Equal("Session A Company", sessionACustomer.CompanyName);
        Assert.Equal("Alfreds Futterkiste", unchangedCanonical.CompanyName);
        Assert.Equal("Alfreds Futterkiste", sessionBCustomer.CompanyName);

        using var reset = new HttpRequestMessage(
            HttpMethod.Post,
            "/api/northwind/sandbox/reset");
        reset.Headers.Add("X-Northwind-Sandbox-Session", sessionA);
        using var resetResponse = await client.SendAsync(reset);
        resetResponse.EnsureSuccessStatusCode();

        var resetCustomer = await GetCustomerAsync(
            client,
            "/api/northwind/sandbox/customers/ALFKI",
            sessionA);
        Assert.Equal("Alfreds Futterkiste", resetCustomer.CompanyName);
    }

    private static async Task<CustomerDetail> GetCustomerAsync(
        HttpClient client,
        string path,
        string? sessionId = null)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, path);

        if (sessionId is not null)
        {
            request.Headers.Add("X-Northwind-Sandbox-Session", sessionId);
        }

        using var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CustomerDetail>())!;
    }

    private sealed class NorthwindApiFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                var northwindRegistrations = services
                    .Where(descriptor =>
                        descriptor.ServiceType == typeof(NorthwindDbContext) ||
                        descriptor.ServiceType == typeof(DbContextOptions<NorthwindDbContext>) ||
                        descriptor.ServiceType.GenericTypeArguments.Contains(
                            typeof(NorthwindDbContext)))
                    .ToList();

                foreach (var registration in northwindRegistrations)
                {
                    services.Remove(registration);
                }

                services.AddDbContext<NorthwindDbContext>(options =>
                    options.UseInMemoryDatabase("northwind-tests"));
            });
        }

        public async Task SeedAsync()
        {
            await using var scope = Services.CreateAsyncScope();
            var database = scope.ServiceProvider.GetRequiredService<NorthwindDbContext>();
            await database.Database.EnsureDeletedAsync();
            await database.Database.EnsureCreatedAsync();

            var customer = new Customer
            {
                CustomerId = "ALFKI",
                CompanyName = "Alfreds Futterkiste",
                ContactName = "Maria Anders",
                ContactTitle = "Sales Representative",
                Address = "Obere Str. 57",
                City = "Berlin",
                PostalCode = "12209",
                Country = "Germany",
                Phone = "030-0074321",
            };
            var product = new Product
            {
                ProductId = 1,
                ProductName = "Test product",
                UnitPrice = 10,
            };
            var order = new Order
            {
                OrderId = 1,
                Customer = customer,
                CustomerId = customer.CustomerId,
                OrderDate = new DateTime(1998, 1, 1),
                ShippedDate = new DateTime(1998, 1, 2),
            };
            order.OrderDetails.Add(new Portfolio.ApiService.Data.Entities.OrderDetail
            {
                Order = order,
                OrderId = order.OrderId,
                Product = product,
                ProductId = product.ProductId,
                UnitPrice = 10,
                Quantity = 2,
            });

            database.AddRange(customer, product, order);
            await database.SaveChangesAsync();
        }
    }
}
