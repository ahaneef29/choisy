import { AbstractControl, ValidationErrors } from "@angular/forms";
import { IRegistrationForm } from "../modules/auth/register/user.model";

export class CustomValidator {
    static confirmPasswordValidator(control:AbstractControl) {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }
 
      console.log(password?.value, confirmPassword?.value);
      
      if(password !== confirmPassword) {
         return { confirmPasswordError: true };
      } 
      return null;
    }
  }