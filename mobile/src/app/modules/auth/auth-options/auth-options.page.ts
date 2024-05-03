import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationOptionsViewStep } from './authentication-options.model';
import { BasePage } from '../../universal/base.page';
import { AppConstant } from '../../universal/app-constant';
import { LoginType } from '../../customer/customer.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface IloginForm{
  email: FormControl<string>,
  password: FormControl<string>,

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
  loginTypeEnum = LoginType;
  formGroup!: FormGroup<IloginForm>;


  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) {
    super();

    this.formGroup = this.formBuilder.group({
      email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]} ),
      password: new FormControl('', {nonNullable: true, validators:Validators.required} ),
    })
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
    let args = null;

    switch (type) {
      case LoginType.STANDARD:
        // args = {
        //   username: this.f.username.value,
        //   password: this.f.password.value,
        // };
        break;

      default:
        break;
    }

    // this.pubsubSvc.publishEvent(UserConstant.EVENT_USER_LOGGEDIN_CLICKED, {
    //   ...args,
    //   type,
    // });
    await this.dismiss(args);
  }
}
