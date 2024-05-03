import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from '../../universal/base.page';
import { CustomerService } from '../../customer/customer.service';
import { MediaService } from '../../universal/media/media.service';
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
    private customerSvc: CustomerService, private mediaSvc: MediaService
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

  async onAddStoreLogoClicked() {
    const result = await this.mediaSvc.promptAndUploadPicture();
    if(!result) {
      return;
    }
    
    this.formGroup.controls['businessLogo'].setValue(result);
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

    this.formGroup.controls['businessVideo'].setValue(result);
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
}
