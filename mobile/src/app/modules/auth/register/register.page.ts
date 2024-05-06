import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BasePage } from '../../universal/base.page';
import { CustomerService } from '../../customer/customer.service';
import { MediaService } from '../../universal/media/media.service';
import { AppConstant } from '../../universal/app-constant';
import { IRegistrationForm } from './user.model';
import { CustomValidator } from 'src/app/validators/custom-validators.validator';
import { IAyncUploadPictureResponse, IAyncUploadResponse } from '../../universal/media/download';

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
    private customerSvc: CustomerService, private mediaSvc: MediaService
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
  }

  async onAddStoreLogoClicked() {
    const result = await this.mediaSvc.promptAndUploadPicture();
    if(!result) {
      return;
    }
    
    this.formGroup.controls.businessLogo!.setValue(result as never);
  }

  async onAddStoreVideoClicked($event) {
    const file: File = $event.srcElement.files[0];
    if(AppConstant.DEBUG) {
      console.log('onAttachmentChanged: attachment', file);
    }

    const result = await this.mediaSvc.uploadFile(file);
    if(!result) {
      return;
    }

    this.formGroup.controls.businessVideo!.setValue(result as never);
  }

  async onAttachmentemoveClicked(ev, formControlName, ignorePrompt = false ) {
    if(ev) {
      ev.stopPropagation();
    }

    if(!ignorePrompt) {
      const result = await this.helperSvc.presentConfirmDialog();
      if(!result) {
        return;
      }
    }
    
    this.formGroup.controls[formControlName].setValue(null);
  }

  private _initializeForm() {
    this.formGroup  = this.formBuilder.group<IRegistrationForm>({
      fullname: new FormControl( '', {nonNullable: true, validators: [Validators.required]} ),
      email: new FormControl( '', {nonNullable: true, validators: [Validators.required, Validators.email]}),
      registeringAsBusiness: new FormControl(true, {nonNullable: true, validators: [Validators.required]} ),
      businessName: new FormControl('', {nonNullable: true, validators: [Validators.required]} ),
      businessLogo: new FormControl(null, {nonNullable: true}),
      businessVideo: new FormControl(null, {nonNullable: true} ),
      password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
      confirmPassword: new FormControl('', {
        nonNullable: true, validators: [Validators.required]
     }),
    }) as FormGroup<IRegistrationForm>;

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
