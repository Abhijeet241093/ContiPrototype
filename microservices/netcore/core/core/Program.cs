using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using TokenHelper;
using Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();

builder.Services.AddCors();
builder.Services.AddScoped<IDetectionServices, DetectionServices>();

string key = "chungangprototype";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
      options.TokenValidationParameters =
           new TokenValidationParameters
           {
               ValidateIssuer = false,
               ValidateAudience = false,
               ValidateLifetime = false,
               ValidateIssuerSigningKey = true,

               IssuerSigningKey =
                JwtSecurityKey.Create(key)
           };
      options.Events = new JwtBearerEvents
      {
          OnAuthenticationFailed = context =>
          {
              Console.WriteLine("OnAuthenticationFailed: " +
                  context.Exception.Message);
              return Task.CompletedTask;
          },
          OnTokenValidated = context =>
          {
              Console.WriteLine("OnTokenValidated: " +
                  context.SecurityToken);
              return Task.CompletedTask;
          }
      };

  });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();


app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapControllerRoute(
      name: "default",
      pattern: "{controller}/{action=Index}/{id?}");
});

app.Run();
