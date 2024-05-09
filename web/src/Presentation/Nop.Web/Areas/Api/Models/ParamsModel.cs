using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nop.Web.Framework.Models;

namespace Nop.Web.Areas.Api.Models
{
    public class ParamsModel
    {
        public record GenericSearchModel : BaseSearchModel
        {

        }

        public class LoginParamsModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class PasswordRecoveryParamsModel
        {
            public string Email { get; set; }
        }

        public class ContactUsModel
        {
            public string Subject { get; set; }
            public string Enquiry { get; set; }
        }

        public class CustomerUpdateParamsModel
        {
            public string Fullname { get; set; }
            public string Phone { get; set; }
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }
        public class RegistrationParamsModel
        {
            public string FirstName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
            public string BusinessName { get; set; }
            public int? BusinessLogo { get; set; }
            public int? BusinessVideo { get; set; }
        }

        public class StoreParamsModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string SeSlugName { get; set; }
            public string Email { get; set; }
            public string Color { get; set; }
            public int LogoId { get; set; }
            public int BannerId { get; set; }
            public List<int> CategoryIds { get; set; }
            public string Description { get; set; }
            public string CompanyPhoneNumber { get; set; }
            public string WhatsAppLink { get; set; }
        }

        public class FreeShippingParamsModel
        {
            public int StoreId { get; set; }
            public decimal? FreeShippingAmount { get; set; }
            public int? MinimumOrderAmount { get; set; }
        }


        public class PaymentMethodsParamsModel
        {
            public int StoreId { get; set; }
            public List<string> ActivePaymentMethodSystemNames { get; set; }
            public string BankInformation { get; set; }
        }

        public class ShippingParamsModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public int CountryId { get; set; }
            public decimal Rate { get; set; }
            public int? TransitDays { get; set; }
            public int? TransitDaysTo { get; set; }
            public bool CacheOnDelivery { get; set; }
            //public string WeekDays { get; set; }
            public string StateOrProvinceIds { get; set; }
            public bool IsActive { get; set; }
        }
    }
}