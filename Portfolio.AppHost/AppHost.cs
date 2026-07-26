var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var northwind = builder.AddSqlServer("sql")
    .WithDataVolume()
    .AddDatabase("northwind");

var apiService = builder.AddProject<Projects.Portfolio_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WithReference(northwind)
    .WaitFor(northwind);

builder.AddProject<Projects.Portfolio_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
