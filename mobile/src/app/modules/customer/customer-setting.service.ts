import { Injectable } from '@angular/core';
import { AppSettingService } from '../universal/app-setting.service';
import { CustomerConstant } from './customer-constant';

@Injectable({
  providedIn: 'root',
})
export class CustomerSettingService extends AppSettingService {
  constructor() {
    super();
  }

  putCurrentCustomerEmail(email) {
    return this.dbService
      .putLocal(this.schemaSvc.tables.setting, {
        key: CustomerConstant.KEY_CURRENT_CUSTOMER_EMAIL,
        value: email,
      })
      .then(() => {
        AppSettingService.settingCache.set(
          CustomerConstant.KEY_CURRENT_CUSTOMER_EMAIL,
          email
        );
      });
  }

  getCurrentCustomerEmail() {
    return this.get<string>(CustomerConstant.KEY_CURRENT_CUSTOMER_EMAIL);
  }

  removeCurrentCustomerEmail() {
    return this.remove(CustomerConstant.KEY_CURRENT_CUSTOMER_EMAIL);
  }

  putCurrentCustomerPassword(password) {
    return this.dbService
      .putLocal(this.schemaSvc.tables.setting, {
        key: CustomerConstant.KEY_CURRENT_CUSTOMER_PASSWORD,
        value: password,
      })
      .then(() => {
        AppSettingService.settingCache.set(
          CustomerConstant.KEY_CURRENT_CUSTOMER_PASSWORD,
          password
        );
      });
  }

  getCurrentCustomerPassword() {
    return this.get<string>(CustomerConstant.KEY_CURRENT_CUSTOMER_PASSWORD);
  }

  removeCurrentCustomerPassword() {
    return this.remove(CustomerConstant.KEY_CURRENT_CUSTOMER_PASSWORD);
  }

  putFingerprintEnabled(value = true) {
    return this.dbService
      .putLocal(this.schemaSvc.tables.setting, {
        key: CustomerConstant.KEY_FINGERPRINT_ENABLED,
        value: value == true ? 'yes' : 'no',
      })
      .then(() => {
        AppSettingService.settingCache.set(
          CustomerConstant.KEY_FINGERPRINT_ENABLED,
          value
        );
      });
  }

  getFingerprintEnabled() {
    return this.get(CustomerConstant.KEY_FINGERPRINT_ENABLED).then((value) => {
      if (typeof value === 'undefined' || value === null) {
        return value;
      }
      return value == 'yes' || value == true;
    });
  }

  putLoggedInMethod(values) {
    return this.dbService
      .putLocal(this.schemaSvc.tables.setting, {
        key: CustomerConstant.KEY_LOGGEDIN_METHOD,
        value: values,
      })
      .then(() => {
        AppSettingService.settingCache.set(
          CustomerConstant.KEY_LOGGEDIN_METHOD,
          values
        );
      });
  }

  removeLoggedInMethod() {
    return this.dbService
      .remove(
        this.schemaSvc.tables.setting,
        CustomerConstant.KEY_LOGGEDIN_METHOD
      )
      .then(() => {
        AppSettingService.settingCache.delete(
          CustomerConstant.KEY_LOGGEDIN_METHOD
        );
      });
  }

  getLoggedInMethod() {
    return this.get(CustomerConstant.KEY_LOGGEDIN_METHOD).then(
      (loggedInMethod) => {
        return loggedInMethod;
      }
    );
  }
}
