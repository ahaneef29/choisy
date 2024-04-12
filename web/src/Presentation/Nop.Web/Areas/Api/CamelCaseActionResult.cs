using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Nop.Web.API
{
    public class CamelCaseResult
    {
        public Exception Exception { get; set; }
        public object Data { get; set; }
        public HttpStatusCode StatusCode { get; set; }
    }

    public class CamelCaseActionResult : IActionResult
    {
        private readonly CamelCaseResult _result;

        public CamelCaseActionResult(CamelCaseResult result)
        {
            _result = result;
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            object data = null;
            if (_result.Data != null)
            {
                var contractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                };
                data = JsonConvert.SerializeObject(_result.Data, new JsonSerializerSettings
                {
                    ContractResolver = contractResolver,
                    Formatting = Formatting.Indented
                });
            }

            var objectResult = new ObjectResult(_result.Exception ?? data)
            {
                StatusCode = _result.Exception != null
                    ? StatusCodes.Status500InternalServerError
                    : (_result.StatusCode > 0 ? (int)_result.StatusCode : StatusCodes.Status200OK)
            };

            await objectResult.ExecuteResultAsync(context);
        }
    }
}