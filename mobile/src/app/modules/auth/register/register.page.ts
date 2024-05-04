import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BasePage } from '../../universal/base.page';
import { CustomerService } from '../../customer/customer.service';
import { AppConstant } from '../../universal/app-constant';
import { IRegistrationForm } from './user.model';
import { CustomValidator } from 'src/app/validators/custom-validators.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterPage extends BasePage implements OnInit {
  formGroup!: FormGroup<IRegistrationForm>;

  constructor(
    private formBuilder: FormBuilder,
    private customerSvc: CustomerService
  ) {
    super();
    this._initializeForm();
  }

  ngOnInit() {
    this._preFillForm();
  }

  async onFormSubmitted(data) {
    const customer = {
      email: data.email,
      firstName: data.fullname,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    await this.customerSvc.register(customer);

    if(AppConstant.DEBUG) {
      this._preFillForm();
    }
  }

  private _initializeForm() {
    this.formGroup = this.formBuilder.group<IRegistrationForm>({
      fullname: new FormControl( '', {
        nonNullable: true, 
        validators: [Validators.required]
      }),
      email: new FormControl( '', {
        nonNullable: true, 
        validators: [Validators.required, Validators.email]
      }),
      businessName: new FormControl('', {
        nonNullable: true, 
        validators: [Validators.required]
      }),
      registeringAsBusiness: new FormControl(true, {nonNullable: true} ),
      businessLogo: new FormControl( '', {nonNullable: false}),
      businessVideo: new FormControl('', {nonNullable: false} ),
      password: new FormControl( '', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true, 
        validators: [Validators.required]
     }),  
    });

    this.formGroup.addValidators(CustomValidator.confirmPasswordValidator)
  }

  private _preFillForm() {
    const randomNum = this.helperSvc.getRandomNumber();
    if (randomNum && AppConstant.DEBUG) {
      this.formGroup.controls.fullname.setValue(randomNum as any);
      this.formGroup.controls.email.setValue(`${randomNum}@gmail.com`);
      this.formGroup.controls.password.setValue(`password`);
      this.formGroup.controls.confirmPassword.setValue(`password`);
      this.formGroup.controls.businessName.setValue(randomNum as any);
    }
  }
}
