import { FormControl } from "@angular/forms";

export interface IRegistrationForm {
  fullname: FormControl<string>;
  email: FormControl<string>;
  businessName: FormControl<string>;
  registeringAsBusiness: FormControl<boolean>;
  businessLogo?: FormControl<string | null>;
  businessVideo?: FormControl<string | null>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}