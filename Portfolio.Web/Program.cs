using Portfolio.Web;
using Portfolio.Web.Components;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();
builder.AddRedisOutputCache("cache");

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddHttpClient<WeatherApiClient>(client =>
    {
        // This URL uses "https+http://" to indicate HTTPS is preferred over HTTP.
        // Learn more about service discovery scheme resolution at https://aka.ms/dotnet/sdschemes.
        client.BaseAddress = new("https+http://apiservice");
    });

builder.Services.AddHttpClient("apiservice", client =>
{
    client.BaseAddress = new("https+http://apiservice");
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseAntiforgery();

app.UseOutputCache();

app.MapStaticAssets();

app.MapMethods("/api/northwind/{**path}", ["GET", "POST", "PUT"], async (
    string? path,
    HttpContext context,
    IHttpClientFactory httpClientFactory,
    CancellationToken cancellationToken) =>
{
    var client = httpClientFactory.CreateClient("apiservice");
    var target = $"api/northwind/{path}{context.Request.QueryString}";
    const string sandboxCookie = "northwind-sandbox-session";
    var sandboxSession = context.Request.Cookies[sandboxCookie];

    if (!Guid.TryParse(sandboxSession, out _))
    {
        sandboxSession = Guid.NewGuid().ToString();
        context.Response.Cookies.Append(
            sandboxCookie,
            sandboxSession,
            new CookieOptions
            {
                HttpOnly = true,
                IsEssential = true,
                SameSite = SameSiteMode.Strict,
                Secure = context.Request.IsHttps,
            });
    }

    using var request = new HttpRequestMessage(HttpMethod.Parse(context.Request.Method), target);
    request.Headers.Add("X-Northwind-Sandbox-Session", sandboxSession);

    if (context.Request.ContentLength > 0)
    {
        request.Content = new StreamContent(context.Request.Body);

        if (context.Request.ContentType is not null)
        {
            request.Content.Headers.ContentType =
                System.Net.Http.Headers.MediaTypeHeaderValue.Parse(context.Request.ContentType);
        }
    }

    using var response = await client.SendAsync(
        request,
        HttpCompletionOption.ResponseHeadersRead,
        cancellationToken);

    context.Response.StatusCode = (int)response.StatusCode;

    if (response.Content.Headers.ContentType is not null)
    {
        context.Response.ContentType = response.Content.Headers.ContentType.ToString();
    }

    await response.Content.CopyToAsync(context.Response.Body, cancellationToken);
});

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.MapDefaultEndpoints();

app.Run();
