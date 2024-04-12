using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Nop.Core;
using Nop.Core.Domain.Customers;
using Nop.Core.Infrastructure;
using Nop.Data;
using Nop.Services.Authentication.External;
using Nop.Services.Common;
using Nop.Services.Customers;
using Nop.Services.Localization;
using Nop.Services.Stores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Nop.Web.API.Infrastructure
{
    public class HeaderParserMiddleware
    {
        private readonly RequestDelegate _next;

        public HeaderParserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if (!httpContext.Request.Path.HasValue)
            {
                await _next(httpContext);
                return;
            }

            var currentPath = httpContext.Request.Path.Value.ToLower();
            if (currentPath.Contains("getguestcustomer")
                || currentPath.Contains("getdefaultstorecategories")
                || currentPath.Contains("test"))
            {
                await _next(httpContext);
                return;
            }

            //check whether database is installed
            if (DataSettingsManager.IsDatabaseInstalled())
            {
                var customerService = EngineContext.Current.Resolve<ICustomerService>();
                var workContext = EngineContext.Current.Resolve<IWorkContext>();
                var storeContext = EngineContext.Current.Resolve<IStoreContext>();
                var languageService = EngineContext.Current.Resolve<ILanguageService>();
                var genericAttributeService = EngineContext.Current.Resolve<IGenericAttributeService>();
                var storeService = EngineContext.Current.Resolve<IStoreService>();

                StringValues token;
                var cgSucceeded = httpContext.Request.Headers.TryGetValue("token", out token);

                StringValues email;
                var eSucceeded = httpContext.Request.Headers.TryGetValue("email", out email);

                StringValues password;
                var pSucceeded = httpContext.Request.Headers.TryGetValue("password", out password);

                Customer customer = null;
                if (!string.IsNullOrEmpty(token))
                {
                    var guid = Guid.Parse(token);
                    customer = await customerService.GetCustomerByGuidAsync(guid);
                }
                else
                {
                    if (!string.IsNullOrEmpty(email))
                    {
                        customer = await customerService.GetCustomerByEmailAsync(email);
                    }
                    else if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password))
                    {
                        var customerRegistrationService = EngineContext.Current.Resolve<ICustomerRegistrationService>();
                        var loginResult = await customerRegistrationService.ValidateCustomerAsync(email, password);

                        if (loginResult != CustomerLoginResults.Successful)
                            customer = null;
                    }
                    //else
                    //{
                    //    //external auth
                    //    var externalAuthenticationRecordRepository = EngineContext.Current.Resolve<IRepository<ExternalAuthenticationRecord>>();
                    //    var associationRecord = externalAuthenticationRecordRepository.Table.FirstOrDefault(record =>
                    //        record.Email.Equals(customer.Email) && record.ProviderSystemName.Equals("ExternalAuth.Facebook"));
                    //    if (associationRecord == null)
                    //        customer = null;
                    //}
                }

                if (customer == null || (customer != null && (!customer.Active || customer.Deleted)))
                {
                    httpContext.Response.Clear();
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await httpContext.Response.WriteAsync("Unauthorized");
                    return;
                }

                await workContext.SetCurrentCustomerAsync(customer);

                //var crGuest = await customerService.GetCustomerRoleBySystemNameAsync(NopCustomerDefaults.GuestsRoleName);
                //var customerRoles = (await customerService.GetCustomerRolesAsync(customer))
                //    .Select(cr => cr.Id)
                //    .ToList();
                //if (!customerRoles.Contains(crGuest.Id))
                //{
                //    var crStoreOwner = await customerService.GetCustomerRoleBySystemNameAsync(NopCustomerDefaults.StoreOwner);
                //    var crAdmin = await customerService.GetCustomerRoleBySystemNameAsync(NopCustomerDefaults.AdministratorsRoleName);
                //    if (!customerRoles.Contains(crStoreOwner.Id)
                //        && !customerRoles.Contains(crAdmin.Id))
                //    {
                //        httpContext.Response.Clear();
                //        httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                //        await httpContext.Response.WriteAsync("Unauthorized: Not store owner");
                //        return;
                //    }

                //    //store
                //    var allStores = await storeService.GetAllStoresAsync();
                //    var store = allStores.FirstOrDefault(s => s.Id == customer.RegisteredInStoreId);
                //    storeContext.SetCurrentStore(store);
                //}

                StringValues workingLanguage;
                var lgSucceeded = httpContext.Request.Headers.TryGetValue("workingLanguage", out workingLanguage);
                if (lgSucceeded && !string.IsNullOrEmpty(workingLanguage))
                {
                    var language = (await languageService.GetAllLanguagesAsync())
                        .FirstOrDefault(l => l.UniqueSeoCode == workingLanguage);
                    if (language != null)
                    {
                        await workContext.SetWorkingLanguageAsync(language);
                        //read back the language to set the cache to current language...
                        var test = (await workContext.GetWorkingLanguageAsync()).Id;
                    }
                }
            }

            await _next(httpContext);
        }
    }

    public static class HeaderParserMiddlewareExtensions
    {
        public static void UseHeaderParser(this IApplicationBuilder application)
        {
            application.UseMiddleware<HeaderParserMiddleware>();
        }
    }
}
