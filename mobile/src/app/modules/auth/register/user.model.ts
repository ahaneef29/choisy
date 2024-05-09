import { FormControl } from "@angular/forms";
import { IAyncUploadPictureResponse, IAyncUploadResponse } from "../../universal/media/download";

export interface IRegistrationForm {
    fullname: FormControl<string>;
    email: FormControl<string>;
    registeringAsBusiness: FormControl<boolean>;
    businessName: FormControl<string>;
    businessLogo?: FormControl<IAyncUploadPictureResponse> | FormControl<null>;
    businessVideo?: FormControl<IAyncUploadResponse> | FormControl<null>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }

  export interface IRegistrationParams {
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    businessLogo: number;
    businessVideo: number;
}