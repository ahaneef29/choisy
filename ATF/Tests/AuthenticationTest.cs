using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace ATF.Tests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class AuthenticationTest : PageTest
{
    [Test]
    public async Task GuestUserShouldSeeAuthenticationOptionDialog()
    {
        var ctx = new BrowserContext();
        var page = await ctx.StartPlaywright();
        await page.GotoAsync("http://localhost:8100/home/tab3");

        await page.Locator("ion-tab-button").Nth(2).ClickAsync();
        await Expect(page.Locator("app-auth-options")).ToBeVisibleAsync();
    }
}