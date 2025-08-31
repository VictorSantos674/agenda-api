using Microsoft.EntityFrameworkCore;
using AgendaAPI.Data;
using AgendaAPI.Repositories;
using AgendaAPI.Services;
using AgendaAPI.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using AutoMapper;
using AgendaAPI.Mappings;
using AgendaAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "Agenda API", 
        Version = "v1",
        Description = "API para gerenciamento de contatos",
        Contact = new OpenApiContact {
            Name = "Suporte",
            Email = "suporte@agenda.com"
        }
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Entity Framework
builder.Services.AddDbContext<AgendaContext>(options =>
    options.UseInMemoryDatabase("AgendaDB"));

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// MediatR
builder.Services.AddMediatR(cfg => 
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
});

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "SuperSecretKey@2025$AgendaAPI*Min32CharactersLong";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "AgendaAPI",
        ValidAudience = jwtSettings["Audience"] ?? "AgendaApp",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
    
    // Para debug
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Dependency Injection
builder.Services.AddScoped<IContatoRepository, ContatoRepository>();
builder.Services.AddScoped<IContatoService, ContatoService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS - Configuração robusta
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
            "http://localhost:8080",
            "https://localhost:8080",
            "http://127.0.0.1:8080",
            "https://*.app.github.dev",
            "http://*.app.github.dev"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
        
        policy.SetIsOriginAllowed(origin => 
            origin.Contains("localhost") || 
            origin.Contains("127.0.0.1") || 
            origin.Contains("github.dev"));
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Agenda API v1");
        c.OAuthClientId("swagger-ui");
        c.OAuthAppName("Agenda API - Swagger");
        c.ConfigObject.DisplayRequestDuration = true;
    });
    
    Console.WriteLine("🚀 Ambiente de desenvolvimento");
}

// CORS - Deve vir primeiro!
app.UseCors("AllowAll");

app.UseHttpsRedirection();

// Middleware de logging para debug
app.Use(async (context, next) =>
{
    Console.WriteLine($"📥 Request: {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"📤 Response: {context.Response.StatusCode}");
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => 
{
    Console.WriteLine("✅ Health check realizado");
    return Results.Ok(new { 
        status = "Healthy", 
        timestamp = DateTime.UtcNow,
        version = "1.0.0"
    });
});

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AgendaContext>();
    try
    {
        DbInitializer.Initialize(context);
        Console.WriteLine("✅ Database inicializado com sucesso");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro ao inicializar database: {ex.Message}");
    }
}

// Log de inicialização
Console.WriteLine("=========================================");
Console.WriteLine("🚀 Agenda API iniciada com sucesso!");
Console.WriteLine($"📍 URL: http://localhost:5018");
Console.WriteLine($"📚 Swagger: http://localhost:5018/swagger");
Console.WriteLine("🔐 Usuário padrão: admin@agenda.com / Admin@123");
Console.WriteLine("=========================================");

app.Run();