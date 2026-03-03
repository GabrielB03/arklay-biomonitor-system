using Microsoft.AspNetCore.Server.Kestrel.Core;
using Umbrella.Server.Hubs;
using Umbrella.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5000, o => o.Protocols = HttpProtocols.Http2);
    options.ListenLocalhost(5001, o => o.Protocols = HttpProtocols.Http1);
});

builder.Services.AddGrpc();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("UmbrellaPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("UmbrellaPolicy");

app.MapGrpcService<BiometryService>();
app.MapHub<MonitoringHub>("/monitoring-hub");

app.Run();