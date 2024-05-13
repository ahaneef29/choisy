using Microsoft.Playwright;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATF
{
    public class BrowserContext
    {
        public async Task<IPage> StartPlaywright()
        {
            var playwright = await Playwright.CreateAsync();
            var browser = await playwright.Chromium
                .LaunchAsync(new BrowserTypeLaunchOptions
                {
                    Headless = false,
                    Devtools = true
                });

            var context = await browser.NewContextAsync(new BrowserNewContextOptions
            {
                JavaScriptEnabled = true,
                //RecordVideoDir = ""
            });
            var page = await context.NewPageAsync();
            await page.SetViewportSizeAsync(1280, 900);

            return page;
        }
    }
}
