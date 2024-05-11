import { Injectable } from '@angular/core';
import { BaseService } from '../universal/base.service';
import { CustomerRoleSystemName, ICustomer, ILoginParams, LoginType } from './customer.model';
import { CustomerSettingService } from './customer-setting.service';
import { IRegistrationParams } from '../auth/register/user.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  constructor() {
    super();
  }

  getAndSetGuestCustomer(token?) {
    return this.getData<ICustomer>('Customer/GetGuestCustomer').then(
      async (gc) => {
        //guests don't have email...
        gc.email = gc.customerGuid;
        return this._handleLoginResponse(gc);
      }
    );
  }

  async login(loginType: LoginType, args?: { username; password }) {
    let loader = await this.helperSvc.loader;
    await loader.present();
    try {
      let customer: ICustomer | null = null;

      switch (loginType) {
        case LoginType.STANDARD:
          customer = await this.postData({
            url: `customer/login`,
            body: args,
          })
          break;
        // case LoginType.GOOGLE:
        //   user = await this.googleAuthSvc.login();
        //   break;
        // case LoginType.FACEBOOK:
        //   user = await this.facebookAuthSvc.login();
        //   break;
      }

      if (!customer) {
        return null;
      }

      return this._handleLoginResponse(customer);
    } catch (e) {
      if (!e) {
        await this.helperSvc.presentToastGenericError();
        return;
      }

      // if (e.status == 401) {
      //   const msg = await this.localizationSvc.getResource(
      //     'user.login.usernameOrPasswordWrong'
      //   );
      //   await this.helperSvc.presentToast(msg);
      //   return;
      // }

      // let msg = e.toString();
      // if (e.message) {
      //   msg = e.message;
      // } else if (e.error) {
      //   msg = e.error.toString();
      // }
      // if (e.error?.error_description) {
      //   msg += '\n' + e.error.error_description;
      // }
      // await this.helperSvc.presentToast(msg, false);
      return null;
    } finally {
      if (loader) {
        await loader.dismiss();
      }
    }
  }

  putCustomerLocal(customer: ICustomer) {
    return this.dbService.putLocal(this.schemaSvc.tables.customer, customer);
  }

  async register(customer: IRegistrationParams) {
    return this.postData<string>({
      url: `Customer/Register`,
      body: customer,
    });
  }

  private async _handleLoginResponse(customer: ICustomer) {
    await this.customerSettingSvc.putCurrentCustomerEmail(customer.email);
    await this.putCustomerLocal(customer);
    return customer;
  }
}
