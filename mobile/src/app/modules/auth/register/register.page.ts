import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from '../../universal/base.page';
import { CustomerService } from '../../customer/customer.service';
import { ICustomer } from '../../customer/customer.model';
import { HelperService } from '../../universal/helper.service';
import { AppConstant } from '../../universal/app-constant';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterPage extends BasePage implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customerSvc: CustomerService
  ) {
    super();
    this.formGroup = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registeringAsBusiness: [false, Validators.required],
      businessName: ['', Validators.required],
      businessLogo: [''],
      businessVideo: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    ('');
    const randomNum = this.helperSvc.getRandomNumber();
    if (randomNum && AppConstant.DEBUG) {
      this.formGroup.controls['fullname'].setValue(randomNum);
      this.formGroup.controls['email'].setValue(`${randomNum}@gmail.com`);
      this.formGroup.controls['password'].setValue(`password`);
      this.formGroup.controls['confirmPassword'].setValue(`password`);
      this.formGroup.controls['businessName'].setValue(randomNum);
      this.formGroup.controls['registeringAsBusiness'].setValue(true);
    }
  }

  async onFormSubmitted(data) {
    const customer = {
      email: data.email,
      firstName: data.fullname,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    await this.customerSvc.register(customer);
  }
}
