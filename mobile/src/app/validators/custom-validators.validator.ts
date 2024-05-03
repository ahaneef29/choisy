import { AbstractControl, ValidationErrors } from "@angular/forms";
import { IRegistrationForm } from "../modules/auth/register/user.model";

export class CustomValidator {
 
    static confirmPasswordValidator(control: AbstractControl) {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      if(password !== confirmPassword) {
        return { confirmPasswordError: true };
      } 

      return null;
    }
  }