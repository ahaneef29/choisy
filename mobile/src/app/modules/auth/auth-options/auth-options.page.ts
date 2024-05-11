import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationOptionsViewStep } from './authentication-options.model';
import { BasePage } from '../../universal/base.page';
import { AppConstant } from '../../universal/app-constant';
import { ILoginParams, LoginType } from '../../customer/customer.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerConstant } from '../../customer/customer-constant';

interface IloginForm{
  email: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-auth-options',
  templateUrl: './auth-options.page.html',
  styleUrls: ['./auth-options.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AuthOptionsPage extends BasePage implements OnInit {
  @Input() viewStep!: AuthenticationOptionsViewStep;

  AuthOptionsViewStep = AuthenticationOptionsViewStep;
  formGroup!: FormGroup<IloginForm>;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder) {
    super();

    this.formGroup = this.formBuilder.group<IloginForm>({
      email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]} ),
      password: new FormControl('', {nonNullable: true, validators:Validators.required} ),
    })
  }

  get LoginType() {
    return LoginType;
  }

  get f() {
    return this.formGroup.controls;
  }

  ngOnInit() {
    this.viewStep = this.AuthOptionsViewStep.Slider
  }

  onGoToUrlClicked(url) {
    this.dismiss();
    this.router.navigate([url]);
  }

  async dismiss(data?) {
    await this.modalCtrl.dismiss(data);
  }

  async onGoToStepClicked(step, isCurrentStepValid = true) {
    if (!isCurrentStepValid) {
      return;
    }

    this.viewStep = step;
    if (this.viewStep == 2) {
      if (AppConstant.DEBUG) {
        // this.loginFormGroup.controls['username'].setValue('1');
        // this.loginFormGroup.controls['password'].setValue('password');
      }
    }
    // await this._openModal();
    // if(!this.mobileVerified) {
    //   return;
    // }
    setTimeout(() => {
      document.querySelector('.auth-options')?.setAttribute('step', step);
    });
  }

  async onLoginButtonClicked(type: LoginType) {
    let args: ILoginParams;
    switch (type) {
      case LoginType.STANDARD:
        args = {
          username: this.f.email.value,
          password: this.f.password.value,
        };
        break;

      default:
        break;
    }

    this.pubsubSvc.publishEvent(CustomerConstant.EVENT_USER_LOGGEDIN_CLICKED, { ...args!, type });
    await this.dismiss(args!);
  }
}
