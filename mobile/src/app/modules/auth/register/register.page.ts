import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BasePage } from '../../universal/base.page';
import { CustomerService } from '../../customer/customer.service';
import { MediaService } from '../../universal/media/media.service';
import { AppConstant } from '../../universal/app-constant';
import { IRegistrationForm, IRegistrationParams } from './user.model';
import { CustomValidator } from 'src/app/validators/custom-validators.validator';
import { IAyncUploadPictureResponse, IAyncUploadResponse } from '../../universal/media/download';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterPage extends BasePage implements OnInit, OnDestroy {
  formGroup!: FormGroup<IRegistrationForm>;
  debug = AppConstant.DEBUG;

  private _subscriptions = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private customerSvc: CustomerService, private mediaSvc: MediaService
  ) {
    super();
    this._initializeForm();
  }

  ngOnDestroy(): void {
    if(this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  ngOnInit() {
    this._preFillForm();
    this._subscribeToToggleChanges();
  }

  async onFormSubmitted(data) {
    const customer: IRegistrationParams = {
      email: data.email,
      firstName: data.fullname,
      password: data.password,
      confirmPassword: data.confirmPassword,
      businessName: data.businessName,
      registeringAsBusiness: data.registeringAsBusiness,
      businessLogo: data.businessLogo?.pictureId,
      businessVideo: data.businessVideo?.downloadId,
    };
    try {
      const message = await this.customerSvc.register(customer);
      await this.helperSvc.presentToast(message);
    } catch (error) {
      
    }

    this.formGroup.reset();
    this.router.navigate(['/']);
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

  onRefreshFormClicked() {
    this._preFillForm();
  }

  onClearFormClicked() {
    this.formGroup.reset();
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

  private _subscribeToToggleChanges() {
    const businessName = this.formGroup.get('businessName');
    this._subscriptions.add(
      this.formGroup.controls.registeringAsBusiness?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          businessName?.setValidators([Validators.required]);
        } else {
          businessName?.clearValidators();
        }
        businessName?.updateValueAndValidity({ emitEvent: false }); 
      })
    )
  }
}
