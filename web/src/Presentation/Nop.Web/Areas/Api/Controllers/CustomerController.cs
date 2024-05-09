using System.Net;
using DocumentFormat.OpenXml.EMMA;
using LinqToDB.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Nop.Core;
using Nop.Core.Domain.Common;
using Nop.Core.Domain.Customers;
using Nop.Core.Domain.Directory;
using Nop.Core.Domain.Forums;
using Nop.Core.Domain.Gdpr;
using Nop.Core.Domain.Localization;
using Nop.Core.Domain.Media;
using Nop.Core.Domain.Messages;
using Nop.Core.Domain.Tax;
using Nop.Core.Domain.Vendors;
using Nop.Core.Events;
using Nop.Core.Infrastructure;
using Nop.Services.Authentication;
using Nop.Services.Authentication.External;
using Nop.Services.Catalog;
using Nop.Services.Common;
using Nop.Services.Customers;
using Nop.Services.Directory;
using Nop.Services.Gdpr;
using Nop.Services.Helpers;
using Nop.Services.Localization;
using Nop.Services.Logging;
using Nop.Services.Media;
using Nop.Services.Messages;
using Nop.Services.Orders;
using Nop.Services.Payments;
using Nop.Services.Seo;
using Nop.Services.Tax;
using Nop.Services.Vendors;
using Nop.Web.API;
using Nop.Web.Areas.Admin.Factories;
using Nop.Web.Areas.Api.Models;
using Nop.Web.Models.Customer;
using ILogger = Nop.Services.Logging.ILogger;

namespace Nop.Web.Areas.Api.Controllers
{
    public class CustomerController : BaseApiController
    {
        #region Constants & Fields 

        private readonly ICustomerService _customerService;
        private readonly IWorkContext _workContext;
        private readonly ILogger _logger;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEventPublisher _eventPublisher;
        private readonly IStoreContext _storeContext;
        private readonly ICustomerRegistrationService _customerRegistrationService;
        private readonly IGenericAttributeService _genericAttributeService;
        private readonly ITaxService _taxService;
        private readonly IWorkflowMessageService _workflowMessageService;
        private readonly INewsLetterSubscriptionService _newsLetterSubscriptionService;
        private readonly IGdprService _gdprService;
        private readonly ILocalizationService _localizationService;
        private readonly IAddressService _addressService;
        private readonly IWebHelper _webHelper;
        private readonly ICustomerModelFactory _customerModelFactory;
        private readonly IShoppingCartService _shoppingCartService;
        private readonly ICustomerActivityService _customerActivityService;
        private readonly IOrderService _orderService;
        private readonly IDateTimeHelper _dateTimeHelper;
        private readonly IOrderProcessingService _orderProcessingService;
        private readonly ICurrencyService _currencyService;
        private readonly IPriceFormatter _priceFormatter;
        private readonly IProductService _productService;
        private readonly IVendorService _vendorService;
        private readonly IPictureService _pictureService;
        private readonly IDownloadService _downloadService;
        private readonly IProductModelFactory _productModelFactory;
        private readonly IPaymentPluginManager _paymentPluginManager;
        private readonly IPaymentService _paymentService;
        private readonly IOrderModelFactory _orderModelFactory;
        private readonly IExternalAuthenticationService _externalAuthenticationService;
        private readonly IUrlRecordService _urlRecordService;

        private readonly CustomerSettings _customerSettings;
        private readonly DateTimeSettings _dateTimeSettings;
        private readonly TaxSettings _taxSettings;
        private readonly LocalizationSettings _localizationSettings;
        private readonly GdprSettings _gdprSettings;
        private readonly ForumSettings _forumSettings;
        private readonly CurrencySettings _currencySettings;
        private readonly MediaSettings _mediaSettings;
        private readonly VendorSettings _vendorSettings;

        public CustomerController()
        {
            this._customerService = EngineContext.Current.Resolve<ICustomerService>();
            this._workContext = EngineContext.Current.Resolve<IWorkContext>();
            this._logger = EngineContext.Current.Resolve<ILogger>();
            this._authenticationService = EngineContext.Current.Resolve<IAuthenticationService>();
            this._eventPublisher = EngineContext.Current.Resolve<IEventPublisher>();
            this._storeContext = EngineContext.Current.Resolve<IStoreContext>();
            this._customerRegistrationService = EngineContext.Current.Resolve<ICustomerRegistrationService>();
            this._genericAttributeService = EngineContext.Current.Resolve<IGenericAttributeService>();
            this._taxService = EngineContext.Current.Resolve<ITaxService>();
            this._workflowMessageService = EngineContext.Current.Resolve<IWorkflowMessageService>();
            this._newsLetterSubscriptionService = EngineContext.Current.Resolve<INewsLetterSubscriptionService>();
            this._gdprService = EngineContext.Current.Resolve<IGdprService>();
            this._localizationService = EngineContext.Current.Resolve<ILocalizationService>();
            this._addressService = EngineContext.Current.Resolve<IAddressService>();
            this._webHelper = EngineContext.Current.Resolve<IWebHelper>();
            this._customerModelFactory = EngineContext.Current.Resolve<ICustomerModelFactory>();
            this._shoppingCartService = EngineContext.Current.Resolve<IShoppingCartService>();
            this._customerActivityService = EngineContext.Current.Resolve<ICustomerActivityService>();
            this._orderService = EngineContext.Current.Resolve<IOrderService>();
            this._dateTimeHelper = EngineContext.Current.Resolve<IDateTimeHelper>();
            this._orderProcessingService = EngineContext.Current.Resolve<IOrderProcessingService>();
            this._currencyService = EngineContext.Current.Resolve<ICurrencyService>();
            this._priceFormatter = EngineContext.Current.Resolve<IPriceFormatter>();
            this._productService = EngineContext.Current.Resolve<IProductService>();
            this._vendorService = EngineContext.Current.Resolve<IVendorService>();
            this._pictureService = EngineContext.Current.Resolve<IPictureService>();
            this._downloadService = EngineContext.Current.Resolve<IDownloadService>();
            this._productModelFactory = EngineContext.Current.Resolve<IProductModelFactory>();
            this._paymentPluginManager = EngineContext.Current.Resolve<IPaymentPluginManager>();
            this._paymentService = EngineContext.Current.Resolve<IPaymentService>();
            this._externalAuthenticationService = EngineContext.Current.Resolve<IExternalAuthenticationService>();
            this._orderModelFactory = EngineContext.Current.Resolve<IOrderModelFactory>();
            this._urlRecordService = EngineContext.Current.Resolve<IUrlRecordService>();

            this._customerSettings = EngineContext.Current.Resolve<CustomerSettings>();
            this._dateTimeSettings = EngineContext.Current.Resolve<DateTimeSettings>();
            this._taxSettings = EngineContext.Current.Resolve<TaxSettings>();
            this._localizationSettings = EngineContext.Current.Resolve<LocalizationSettings>();
            this._gdprSettings = EngineContext.Current.Resolve<GdprSettings>();
            this._forumSettings = EngineContext.Current.Resolve<ForumSettings>();
            this._currencySettings = EngineContext.Current.Resolve<CurrencySettings>();
            this._mediaSettings = EngineContext.Current.Resolve<MediaSettings>();
            this._vendorSettings = EngineContext.Current.Resolve<VendorSettings>();
        }

        #endregion

        [HttpGet("GetGuestCustomer")]
        public async Task<IActionResult> GetGuestCustomer(string token = "")
        {
            try
            {
                Customer customer = null;
                if (!string.IsNullOrEmpty(token))
                {
                    var guid = Guid.Parse(token);
                    customer = await _customerService.GetCustomerByGuidAsync(guid);
                }

                if (customer == null)
                    customer = await _customerService.InsertGuestCustomerAsync();

                var model = await this.PrepareCustomerInfo(customer);

                return new CamelCaseActionResult(new CamelCaseResult
                {
                    Data = model,
                    StatusCode = HttpStatusCode.OK
                });
            }
            catch (Exception ex)
            {
                await _logger.ErrorAsync(ex.Message, ex);

                return new CamelCaseActionResult(new CamelCaseResult
                {
                    Exception = ex,
                    StatusCode = HttpStatusCode.InternalServerError
                });

            }
        }

        [HttpGet("GetCustomer")]
        public async Task<IActionResult> GetCustomer()
        {
            var customer = await _workContext.GetCurrentCustomerAsync();
            var model = await PrepareCustomerInfo(customer);

            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = model,
                StatusCode = HttpStatusCode.OK
            });
        }

        [HttpPost("UpdateCustomer")]
        public async Task<IActionResult> UpdateCustomer(ParamsModel.CustomerUpdateParamsModel paramsModel)
        {
            var customer = await _workContext.GetCurrentCustomerAsync();
            if (!await _customerService.IsRegisteredAsync(customer))
                return new CamelCaseActionResult(new CamelCaseResult
                {
                    StatusCode = HttpStatusCode.BadRequest
                });

            //if (!string.IsNullOrEmpty(paramsModel.Fullname))
            //    await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.FirstNameAttribute, paramsModel.Fullname);

            //if (!string.IsNullOrEmpty(paramsModel.Phone))
            //    await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.PhoneAttribute, paramsModel.Phone);

            if (!string.IsNullOrEmpty(paramsModel.NewPassword) && !string.IsNullOrEmpty(paramsModel.OldPassword))
            {
                var changePasswordRequest = new ChangePasswordRequest(customer.Email,
                    true, _customerSettings.DefaultPasswordFormat, paramsModel.NewPassword, paramsModel.OldPassword);
                var changePasswordResult = await _customerRegistrationService.ChangePasswordAsync(changePasswordRequest);
                if (!changePasswordResult.Success)
                {
                    //errors
                    return new CamelCaseActionResult(new CamelCaseResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Data = string.Join(", ", changePasswordResult.Errors)
                    });
                }
            }

            var model = await PrepareCustomerInfo(customer);
            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = model,
                StatusCode = HttpStatusCode.OK
            });
        }

        //[HttpPost("Login")]
        //public async Task<IActionResult> Login([FromBody] ParamsModel.LoginParamsModel loginParamsModel)
        //{
        //    ////validate CAPTCHA
        //    //if (_captchaSettings.Enabled && _captchaSettings.ShowOnLoginPage && !captchaValid)
        //    //{
        //    //    ModelState.AddModelError("", await _localizationService.GetResourceAsync("Common.WrongCaptchaMessage"));
        //    //}

        //    string errorMessage = await string.Empty;
        //    if (string.IsNullOrEmpty(loginParamsModel.Username))
        //        errorMessage = await await _localizationService.GetResourceAsync("Account.Login.Fields.Email.Required"
        //            , (await _workContext.GetWorkingLanguageAsync()).Id);
        //    else if (string.IsNullOrEmpty(loginParamsModel.Username))
        //        errorMessage = await await _localizationService.GetResourceAsync("Account.Fields.ConfirmPassword.Required"
        //            , (await _workContext.GetWorkingLanguageAsync()).Id);

        //    var model = new
        //    {
        //        Username = loginParamsModel.Username.Trim(),
        //        Email = loginParamsModel.Username.Trim(),
        //        Password = loginParamsModel.Password,
        //        RememberMe = false
        //    };

        //    if (!string.IsNullOrEmpty(errorMessage))
        //    {
        //        return new CamelCaseActionResult(new CamelCaseResult
        //        {
        //            StatusCode = HttpStatusCode.BadRequest,
        //            Data = errorMessage
        //        });
        //    }

        //    try
        //    {
        //        //    var loginResult = await _customerRegistrationService.ValidateCustomerAsync(
        //        //        _customerSettings.UsernamesEnabled ? model.Username : model.Email, model.Password);
        //        //    switch (loginResult)
        //        //    {
        //        //        case CustomerLoginResults.Successful:
        //        //            {
        //        //                var customer = _customerSettings.UsernamesEnabled
        //        //                    ? await _customerService.GetCustomerByUsernameAsync(model.Username)
        //        //                    : await _customerService.GetCustomerByEmailAsync(model.Email);

        //        //                if ((await _workContext.GetCurrentCustomerAsync())?.Id != customer.Id)
        //        //                {
        //        //                    //migrate shopping cart
        //        //                    await _shoppingCartService.MigrateShoppingCartAsync(await _workContext.GetCurrentCustomerAsync(), customer, true);

        //        //                    await _workContext.SetCurrentCustomerAsync(customer);
        //        //                }

        //        //                //sign in new customer
        //        //                await _authenticationService.SignInAsync(customer, model.RememberMe);

        //        //                //raise event       
        //        //                await _eventPublisher.PublishAsync(new CustomerLoggedinEvent(customer));

        //        //                //activity log
        //        //                await _customerActivityService.InsertActivityAsync(customer, "PublicStore.Login",
        //        //                    await _localizationService.GetResourceAsync("ActivityLog.PublicStore.Login"), customer);

        //        //                var infor = await this.PrepareCustomerInfo(customer);
        //        //                return new HttpResponseModel<object>
        //        //                {
        //        //                    Data = infor,
        //        //                    StatusCode = HttpStatusCode.OK
        //        //                };
        //        //            }
        //        //        case CustomerLoginResults.CustomerNotExist:
        //        //            return new HttpResponseModel<object>
        //        //            {
        //        //                StatusCode = HttpStatusCode.BadRequest,
        //        //                Data = false,
        //        //                Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.CustomerNotExist"
        //        //                    , (await _workContext.GetWorkingLanguageAsync()).Id)
        //        //            };
        //        //        case CustomerLoginResults.Deleted:
        //        //            return new HttpResponseModel<object>
        //        //            {
        //        //                StatusCode = HttpStatusCode.BadRequest,
        //        //                Data = false,
        //        //                Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.Deleted"
        //        //                    , (await _workContext.GetWorkingLanguageAsync()).Id)
        //        //            };
        //        //        case CustomerLoginResults.NotActive:
        //        //            return new HttpResponseModel<object>
        //        //            {
        //        //                StatusCode = HttpStatusCode.BadRequest,
        //        //                Data = false,
        //        //                Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.NotActive"
        //        //                    , (await _workContext.GetWorkingLanguageAsync()).Id)
        //        //            };
        //        //        case CustomerLoginResults.NotRegistered:
        //        //            return new HttpResponseModel<object>
        //        //            {
        //        //                StatusCode = HttpStatusCode.BadRequest,
        //        //                Data = false,
        //        //                Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.NotRegistered"
        //        //                    , (await _workContext.GetWorkingLanguageAsync()).Id)
        //        //            };
        //        //        case CustomerLoginResults.LockedOut:
        //        //            return new HttpResponseModel<object>
        //        //            {
        //        //                StatusCode = HttpStatusCode.BadRequest,
        //        //                Data = false,
        //        //                Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.LockedOut"
        //        //                    , (await _workContext.GetWorkingLanguageAsync()).Id)
        //        //            };
        //        //        case CustomerLoginResults.WrongPassword:
        //        //        default:
        //        //            return new HttpResponseModel<object>
        //        //            {
        //        //                StatusCode = HttpStatusCode.BadRequest,
        //        //                Data = false,
        //        //                Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials"
        //        //                    , (await _workContext.GetWorkingLanguageAsync()).Id)
        //        //            };
        //        //    }
        //    }
        //    catch (Exception ex)
        //    {
        //        await _logger.ErrorAsync(ex.Message, ex, await _workContext.GetCurrentCustomerAsync());

        //        return new CamelCaseActionResult(new CamelCaseResult
        //        {
        //            Exception = ex,
        //            StatusCode = HttpStatusCode.InternalServerError
        //        });
        //    }
        //}

        //[HttpPost("PasswordRecoverySend")]
        //public async Task<HttpResponseModel<object>> PasswordRecoverySend(ParamsModel.PasswordRecoveryParamsModel model)
        //{
        //    if (string.IsNullOrEmpty(model.Email))
        //    {
        //        return new HttpResponseModel<object>
        //        {
        //            StatusCode = HttpStatusCode.BadRequest,
        //            Message = await _localizationService.GetResourceAsync("Account.Login.Fields.Email.Required", (await _workContext.GetWorkingLanguageAsync()).Id)
        //        };
        //    }

        //    var customer = await _customerService.GetCustomerByEmailAsync(model.Email);
        //    if (customer == null || customer.Deleted || !customer.Active)
        //    {
        //        return new HttpResponseModel<object>
        //        {
        //            StatusCode = HttpStatusCode.BadRequest,
        //            Message = await _localizationService.GetResourceAsync("Account.PasswordRecovery.EmailNotFound", (await _workContext.GetWorkingLanguageAsync()).Id)
        //        };
        //    }

        //    //save token and current date
        //    var passwordRecoveryToken = Guid.NewGuid();
        //    await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.PasswordRecoveryTokenAttribute,
        //        passwordRecoveryToken.ToString());

        //    DateTime? generatedDateTime = DateTime.UtcNow;
        //    await _genericAttributeService.SaveAttributeAsync(customer,
        //        NopCustomerDefaults.PasswordRecoveryTokenDateGeneratedAttribute, generatedDateTime);

        //    //send email
        //    await _workflowMessageService.SendCustomerPasswordRecoveryMessageAsync(customer,
        //        (await _workContext.GetWorkingLanguageAsync()).Id);

        //    return new HttpResponseModel<object>
        //    {
        //        StatusCode = HttpStatusCode.OK,
        //        Message = await _localizationService.GetResourceAsync("Account.PasswordRecovery.EmailHasBeenSent", (await _workContext.GetWorkingLanguageAsync()).Id)
        //    };
        //}

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] ParamsModel.RegistrationParamsModel paramsModel)
        {
            //check whether registration is allowed
            if (_customerSettings.UserRegistrationType == UserRegistrationType.Disabled)
                return new CamelCaseActionResult(new CamelCaseResult
                {
                    Data = null,
                    StatusCode = HttpStatusCode.BadRequest
                });

            try
            {
                bool isModelValid = true;
                string errorMessage = string.Empty;

                int workLanguageId = (await _workContext.GetWorkingLanguageAsync()).Id;
                if (string.IsNullOrEmpty(paramsModel.FirstName))
                {
                    isModelValid = false;
                    errorMessage = await _localizationService.GetResourceAsync("Account.Fields.FirstName.Required", workLanguageId);
                }
                //else if (string.IsNullOrEmpty(paramsModel.LastName))
                //{
                //    isModelValid = false;
                //    errorMessage = await _localizationService.GetResourceAsync("Account.Fields.LastName.Required", workLanguageId);
                //}
                else if (string.IsNullOrEmpty(paramsModel.Email))
                {
                    isModelValid = false;
                    errorMessage = await _localizationService.GetResourceAsync("Account.Fields.Email.Required", workLanguageId);
                }
                //else if (string.IsNullOrEmpty(paramsModel.Phone))
                //{
                //    isModelValid = false;
                //    errorMessage = await _localizationService.GetResourceAsync("Address.Fields.PhoneNumber.Required", workLanguageId);
                //}
                else if (string.IsNullOrEmpty(paramsModel.Password))
                {
                    isModelValid = false;
                    errorMessage = await _localizationService.GetResourceAsync("Account.Fields.ConfirmPassword.Required", workLanguageId);
                }
                else if (string.IsNullOrEmpty(paramsModel.ConfirmPassword))
                {
                    isModelValid = false;
                    errorMessage = await _localizationService.GetResourceAsync("Account.Fields.ConfirmPassword.Required", workLanguageId);
                }
                else if (!paramsModel.Password.Equals(paramsModel.ConfirmPassword))
                {
                    isModelValid = false;
                    errorMessage = await _localizationService.GetResourceAsync("Account.Fields.Password.EnteredPasswordsDoNotMatch", workLanguageId);
                }

                if (!isModelValid)
                {
                    return new CamelCaseActionResult(new CamelCaseResult
                    {
                        Data = errorMessage,
                        StatusCode = HttpStatusCode.BadRequest
                    });
                }

                var customer = await _workContext.GetCurrentCustomerAsync();
                if (await _customerService.IsRegisteredAsync(customer))
                {
                    //Already registered customer. 
                    await _authenticationService.SignOutAsync();

                    //raise logged out event       
                    await _eventPublisher.PublishAsync(new CustomerLoggedOutEvent(customer));

                    customer = await _customerService.InsertGuestCustomerAsync();

                    //Save a new record
                    await _workContext.SetCurrentCustomerAsync(customer);
                }

                var store = await _storeContext.GetCurrentStoreAsync();
                customer.RegisteredInStoreId = store.Id;

                var model = new RegisterModel
                {
                    FirstName = paramsModel.FirstName.Trim(),
                    //LastName = paramsModel.LastName,
                    Email = paramsModel.Email.Trim(),
                    Password = paramsModel.Password.Trim(),
                    ConfirmPassword = paramsModel.ConfirmPassword.Trim(),
                    //PhoneEnabled = false,
                    //Phone = paramsModel.Phone
                };

                var customerEmail = model.Email;
                var isApproved = _customerSettings.UserRegistrationType == UserRegistrationType.Standard;
                var registrationRequest = new CustomerRegistrationRequest(customer,
                    model.Email,
                    _customerSettings.UsernamesEnabled ? model.Username : model.Email,
                    model.Password,
                    _customerSettings.DefaultPasswordFormat,
                    store.Id,
                    isApproved);
                var registrationResult = await _customerRegistrationService.RegisterCustomerAsync(registrationRequest);
                if (registrationResult.Success)
                {
                    //properties
                    if (_dateTimeSettings.AllowCustomersToSetTimeZone)
                        customer.TimeZoneId = model.TimeZoneId;

                    //VAT number
                    if (_taxSettings.EuVatEnabled)
                    {
                        customer.VatNumber = model.VatNumber;

                        var (vatNumberStatus, _, vatAddress) = await _taxService.GetVatNumberStatusAsync(model.VatNumber);
                        customer.VatNumberStatusId = (int)vatNumberStatus;
                        //send VAT number admin notification
                        if (!string.IsNullOrEmpty(model.VatNumber) && _taxSettings.EuVatEmailAdminWhenNewVatSubmitted)
                            await _workflowMessageService.SendNewVatSubmittedStoreOwnerNotificationAsync(customer, model.VatNumber, vatAddress
                                , _localizationSettings.DefaultAdminLanguageId);
                    }

                    //form fields
                    if (_customerSettings.GenderEnabled)
                        customer.Gender = model.Gender;
                    if (_customerSettings.FirstNameEnabled)
                        customer.FirstName = model.FirstName;
                    if (_customerSettings.LastNameEnabled)
                        customer.LastName = model.LastName;
                    if (_customerSettings.DateOfBirthEnabled)
                        customer.DateOfBirth = model.ParseDateOfBirth();
                    if (_customerSettings.CompanyEnabled)
                        customer.Company = model.Company;
                    if (_customerSettings.StreetAddressEnabled)
                        customer.StreetAddress = model.StreetAddress;
                    if (_customerSettings.StreetAddress2Enabled)
                        customer.StreetAddress2 = model.StreetAddress2;
                    if (_customerSettings.ZipPostalCodeEnabled)
                        customer.ZipPostalCode = model.ZipPostalCode;
                    if (_customerSettings.CityEnabled)
                        customer.City = model.City;
                    if (_customerSettings.CountyEnabled)
                        customer.County = model.County;
                    if (_customerSettings.CountryEnabled)
                        customer.CountryId = model.CountryId;
                    if (_customerSettings.CountryEnabled && _customerSettings.StateProvinceEnabled)
                        customer.StateProvinceId = model.StateProvinceId;
                    if (_customerSettings.PhoneEnabled)
                        customer.Phone = model.Phone;
                    if (_customerSettings.FaxEnabled)
                        customer.Fax = model.Fax;

                    //newsletter
                    if (_customerSettings.NewsletterEnabled)
                    {
                        var isNewsletterActive = _customerSettings.UserRegistrationType != UserRegistrationType.EmailValidation;

                        //save newsletter value
                        var newsletter = await _newsLetterSubscriptionService.GetNewsLetterSubscriptionByEmailAndStoreIdAsync(customerEmail, store.Id);
                        if (newsletter != null)
                        {
                            if (model.Newsletter)
                            {
                                newsletter.Active = isNewsletterActive;
                                await _newsLetterSubscriptionService.UpdateNewsLetterSubscriptionAsync(newsletter);

                                //GDPR
                                if (_gdprSettings.GdprEnabled && _gdprSettings.LogNewsletterConsent)
                                {
                                    await _gdprService.InsertLogAsync(customer, 0, GdprRequestType.ConsentAgree, await _localizationService.GetResourceAsync("Gdpr.Consent.Newsletter"));
                                }
                            }
                            //else
                            //{
                            //When registering, not checking the newsletter check box should not take an existing email address off of the subscription list.
                            //_newsLetterSubscriptionService.DeleteNewsLetterSubscription(newsletter);
                            //}
                        }
                        else
                        {
                            if (model.Newsletter)
                            {
                                await _newsLetterSubscriptionService.InsertNewsLetterSubscriptionAsync(new NewsLetterSubscription
                                {
                                    NewsLetterSubscriptionGuid = Guid.NewGuid(),
                                    Email = customerEmail,
                                    Active = isNewsletterActive,
                                    StoreId = store.Id,
                                    CreatedOnUtc = DateTime.UtcNow
                                });

                                //GDPR
                                if (_gdprSettings.GdprEnabled && _gdprSettings.LogNewsletterConsent)
                                {
                                    await _gdprService.InsertLogAsync(customer, 0, GdprRequestType.ConsentAgree, await _localizationService.GetResourceAsync("Gdpr.Consent.Newsletter"));
                                }
                            }
                        }
                    }

                    if (_customerSettings.AcceptPrivacyPolicyEnabled)
                    {
                        //privacy policy is required
                        //GDPR
                        if (_gdprSettings.GdprEnabled && _gdprSettings.LogPrivacyPolicyConsent)
                        {
                            await _gdprService.InsertLogAsync(customer, 0, GdprRequestType.ConsentAgree, await _localizationService.GetResourceAsync("Gdpr.Consent.PrivacyPolicy"));
                        }
                    }

                    //GDPR
                    //if (_gdprSettings.GdprEnabled)
                    //{
                    //    var consents = (await _gdprService.GetAllConsentsAsync()).Where(consent => consent.DisplayDuringRegistration).ToList();
                    //    foreach (var consent in consents)
                    //    {
                    //        var controlId = $"consent{consent.Id}";
                    //        var cbConsent = form[controlId];
                    //        if (!StringValues.IsNullOrEmpty(cbConsent) && cbConsent.ToString().Equals("on"))
                    //        {
                    //            //agree
                    //            await _gdprService.InsertLogAsync(customer, consent.Id, GdprRequestType.ConsentAgree, consent.Message);
                    //        }
                    //        else
                    //        {
                    //            //disagree
                    //            await _gdprService.InsertLogAsync(customer, consent.Id, GdprRequestType.ConsentDisagree, consent.Message);
                    //        }
                    //    }
                    //}

                    //insert default address (if possible)
                    var defaultAddress = new Address
                    {
                        FirstName = customer.FirstName,
                        LastName = customer.LastName,
                        Email = customer.Email,
                        Company = customer.Company,
                        CountryId = customer.CountryId > 0
                            ? (int?)customer.CountryId
                            : null,
                        StateProvinceId = customer.StateProvinceId > 0
                            ? (int?)customer.StateProvinceId
                            : null,
                        County = customer.County,
                        City = customer.City,
                        Address1 = customer.StreetAddress,
                        Address2 = customer.StreetAddress2,
                        ZipPostalCode = customer.ZipPostalCode,
                        PhoneNumber = customer.Phone,
                        FaxNumber = customer.Fax,
                        CreatedOnUtc = customer.CreatedOnUtc
                    };
                    if (await _addressService.IsAddressValidAsync(defaultAddress))
                    {
                        //some validation
                        if (defaultAddress.CountryId == 0)
                            defaultAddress.CountryId = null;
                        if (defaultAddress.StateProvinceId == 0)
                            defaultAddress.StateProvinceId = null;
                        //set default address
                        //customer.Addresses.Add(defaultAddress);

                        await _addressService.InsertAddressAsync(defaultAddress);

                        await _customerService.InsertCustomerAddressAsync(customer, defaultAddress);

                        customer.BillingAddressId = defaultAddress.Id;
                        customer.ShippingAddressId = defaultAddress.Id;

                        await _customerService.UpdateCustomerAsync(customer);
                    }

                    //notifications
                    if (_customerSettings.NotifyNewCustomerRegistration)
                        await _workflowMessageService.SendCustomerRegisteredStoreOwnerNotificationMessageAsync(customer,
                            _localizationSettings.DefaultAdminLanguageId);

                    //raise event       
                    await _eventPublisher.PublishAsync(new CustomerRegisteredEvent(customer));
                    var currentLanguage = await _workContext.GetWorkingLanguageAsync();

                    InsertVendor(customer, paramsModel);

                    switch (_customerSettings.UserRegistrationType)
                    {
                        case UserRegistrationType.EmailValidation:
                            //email validation message
                            await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.AccountActivationTokenAttribute, Guid.NewGuid().ToString());
                            await _workflowMessageService.SendCustomerEmailValidationMessageAsync(customer, currentLanguage.Id);

                            return new CamelCaseActionResult(new CamelCaseResult
                            {
                                Data = await _localizationService.GetResourceAsync("Account.Register.Result.EmailValidation", workLanguageId),
                                StatusCode = HttpStatusCode.BadRequest,
                            });

                        case UserRegistrationType.AdminApproval:
                            return new CamelCaseActionResult(new CamelCaseResult
                            {
                                Data = await _localizationService.GetResourceAsync("Account.Register.Result.AdminApproval", workLanguageId),
                                StatusCode = HttpStatusCode.BadRequest,
                            });

                        case UserRegistrationType.Standard:
                            //send customer welcome message
                            await _workflowMessageService.SendCustomerWelcomeMessageAsync(customer, currentLanguage.Id);

                            //raise event       
                            await _eventPublisher.PublishAsync(new CustomerActivatedEvent(customer));

                            return new CamelCaseActionResult(new CamelCaseResult
                            {
                                Data = await _localizationService.GetResourceAsync("Account.Register.Result.Standard", workLanguageId),
                                StatusCode = HttpStatusCode.OK,
                            });

                        default:
                            return new CamelCaseActionResult(new CamelCaseResult
                            {
                                Data = null,
                                StatusCode = HttpStatusCode.BadRequest,
                            });
                    }
                }

                //errors
                var errors = new List<string>();
                foreach (var error in registrationResult.Errors)
                    errors.Add(error);

                return new CamelCaseActionResult(new CamelCaseResult
                {
                    Data = errors,
                    StatusCode = HttpStatusCode.BadRequest,
                });
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex, await _workContext.GetCurrentCustomerAsync());
                return new CamelCaseActionResult(new CamelCaseResult
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Exception = ex
                });
            }
        }

        #region Utillites

        private async Task InsertVendor(Customer customer, ParamsModel.RegistrationParamsModel paramsModel)
        {
            if (string.IsNullOrEmpty(paramsModel.BusinessName))
                return;

            //disabled by default
            var vendor = new Vendor
            {
                Name = paramsModel.BusinessName,
                Email = customer.Email,
                //some default settings
                PageSize = 6,
                AllowCustomersToSelectPageSize = true,
                PageSizeOptions = _vendorSettings.DefaultVendorPageSizeOptions,
                PictureId = paramsModel.BusinessLogo ?? 0,
                VideoId = paramsModel.BusinessVideo ?? 0,
                //Description = WebUtility.HtmlEncode(description),
                Active = true
            };
            await _vendorService.InsertVendorAsync(vendor);

            //search engine name (the same as vendor name)
            var seName = await _urlRecordService.ValidateSeNameAsync(vendor, vendor.Name, vendor.Name, true);
            await _urlRecordService.SaveSlugAsync(vendor, seName, 0);

            //associate to the current customer
            //but a store owner will have to manually add this customer role to "Vendors" role
            //if he wants to grant access to admin area
            customer.VendorId = vendor.Id;
            await _customerService.UpdateCustomerAsync(customer);

            //update picture seo file name
            //await UpdatePictureSeoNamesAsync(vendor);

            //save vendor attributes
            //await _genericAttributeService.SaveAttributeAsync(vendor, NopVendorDefaults.VendorAttributes, vendorAttributesXml);

            //notify store owner here (email)
            await _workflowMessageService.SendNewVendorAccountApplyStoreOwnerNotificationAsync(customer,
                vendor, _localizationSettings.DefaultAdminLanguageId);
        }

        private async Task<object> PrepareCustomerInfo(Customer customer)
        {
            var model = new
            {
                Id = customer.Id,
                CustomerGuid = customer.CustomerGuid.ToString(),
                RegisteredInStoreId = customer.RegisteredInStoreId,
                Email = !string.IsNullOrEmpty(customer.Email) ? customer.Email.ToLower() : customer.CustomerGuid.ToString(),
                IsGuest = await _customerService.IsGuestAsync(customer),
                IsVendor = await _customerService.IsVendorAsync(customer),
                IsAdmin = await _customerService.IsAdminAsync(customer),
                CustomerRoles = (await _customerService.GetCustomerRolesAsync(customer)).Select(r => new
                {
                    r.Id,
                    r.SystemName
                }),
                //FirstName = await _genericAttributeService.GetAttributeAsync<string>(customer, NopCustomerDefaults.FirstNameAttribute),
                FirstName = customer.FirstName,
                //LastName = await _genericAttributeService.GetAttributeAsync<string>(customer, NopCustomerDefaults.LastNameAttribute),
                LastName = customer.LastName,
                FullName = await _customerService.GetCustomerFullNameAsync(customer),
                Phone = customer.Phone,
                //Phone = await _genericAttributeService.GetAttributeAsync<string>(customer, NopCustomerDefaults.PhoneAttribute)
                //AvatarUrl = _pictureService.GetPictureUrl(guestCustomer.GetAttribute<int>(SystemCustomerAttributeNames.AvatarPictureId)),
                //FormattedUserName = guestCustomer.FormatUsername()
            };

            return model;
        }

        protected virtual async Task UpdatePictureSeoNamesAsync(Vendor vendor)
        {
            var picture = await _pictureService.GetPictureByIdAsync(vendor.PictureId);
            if (picture != null)
                await _pictureService.SetSeoFilenameAsync(picture.Id, await _pictureService.GetPictureSeNameAsync(vendor.Name));
        }

        #endregion
    }
}