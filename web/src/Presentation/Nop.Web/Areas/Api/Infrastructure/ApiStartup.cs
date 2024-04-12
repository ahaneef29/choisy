using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nop.Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nop.Web.API.Infrastructure
{
    public class ApiStartup : INopStartup
    {
        public void Configure(IApplicationBuilder application)
        {
            application.UseCors("MyCorsPolicy");

            application.UseWhen(context => context.Request.Path.StartsWithSegments("/api"), appBuilder =>
            {
                appBuilder.UseHeaderParser();
            });
        }

        public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(feature =>
              feature.AddPolicy(
                  "MyCorsPolicy",
                  apiPolicy => apiPolicy
                      .AllowAnyOrigin()
                      //.WithOrigins("https://myotherdomain.com")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .SetIsOriginAllowed(host => true)
                      //.AllowCredentials()
              ));
        }

        public int Order => 100; //should be loaded after common services 
    }
}
