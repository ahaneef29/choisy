import { FormControl } from "@angular/forms";

export interface IRegistrationForm {
    fullname: FormControl<string>;
    email: FormControl<string>;
    registeringAsBusiness: FormControl<boolean>;
    businessName: FormControl<string>;
    businessLogo: FormControl<string>;
    businessVideo: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }