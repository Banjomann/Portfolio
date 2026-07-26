using System.Data;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.ApiService.Data;

public sealed partial class NorthwindDatabaseInitializer(
    NorthwindDbContext dbContext,
    ILogger<NorthwindDatabaseInitializer> logger)
{
    private const string ScriptResourceName = "Portfolio.ApiService.Data.instnwnd.sql";

    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        if (await IsInitializedAsync(cancellationToken))
        {
            logger.LogInformation("Northwind database is already initialized.");
            return;
        }

        logger.LogInformation("Initializing Northwind database from the Microsoft sample script.");

        await using var scriptStream = typeof(NorthwindDatabaseInitializer).Assembly
            .GetManifestResourceStream(ScriptResourceName)
            ?? throw new InvalidOperationException($"Embedded resource '{ScriptResourceName}' was not found.");
        using var reader = new StreamReader(scriptStream);
        var script = await reader.ReadToEndAsync(cancellationToken);

        dbContext.Database.SetCommandTimeout(TimeSpan.FromMinutes(3));
        await dbContext.Database.OpenConnectionAsync(cancellationToken);

        try
        {
            foreach (var batch in BatchSeparator().Split(script))
            {
                if (!string.IsNullOrWhiteSpace(batch))
                {
                    await dbContext.Database.ExecuteSqlRawAsync(batch, cancellationToken);
                }
            }
        }
        finally
        {
            await dbContext.Database.CloseConnectionAsync();
        }

        var customerCount = await dbContext.Customers.CountAsync(cancellationToken);
        var orderCount = await dbContext.Orders.CountAsync(cancellationToken);

        logger.LogInformation(
            "Northwind database initialized with {CustomerCount} customers and {OrderCount} orders.",
            customerCount,
            orderCount);
    }

    private async Task<bool> IsInitializedAsync(CancellationToken cancellationToken)
    {
        var connection = dbContext.Database.GetDbConnection();
        var shouldClose = connection.State != ConnectionState.Open;

        if (shouldClose)
        {
            await connection.OpenAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = """
                SELECT CASE
                    WHEN OBJECT_ID(N'dbo.Customers', N'U') IS NOT NULL
                     AND OBJECT_ID(N'dbo.Orders', N'U') IS NOT NULL
                     AND OBJECT_ID(N'dbo.[Order Details]', N'U') IS NOT NULL
                    THEN 1
                    ELSE 0
                END
                """;

            var schemaExists = Convert.ToInt32(
                await command.ExecuteScalarAsync(cancellationToken)) == 1;

            if (!schemaExists)
            {
                return false;
            }

            command.CommandText = """
                SELECT CASE
                    WHEN EXISTS (SELECT 1 FROM dbo.Customers)
                     AND EXISTS (SELECT 1 FROM dbo.Orders)
                    THEN 1
                    ELSE 0
                END
                """;

            return Convert.ToInt32(
                await command.ExecuteScalarAsync(cancellationToken)) == 1;
        }
        finally
        {
            if (shouldClose)
            {
                await connection.CloseAsync();
            }
        }
    }

    [GeneratedRegex(@"^\s*GO\s*;?\s*$", RegexOptions.IgnoreCase | RegexOptions.Multiline)]
    private static partial Regex BatchSeparator();
}
