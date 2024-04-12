import { Injectable } from '@angular/core';
import { BaseService } from '../universal/base.service';
import { CustomerRoleSystemName, ICustomer } from './customer.model';
import { CustomerSettingService } from './customer-setting.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  constructor() {
    super();
  }

  getCustomerLocal(
    email?,
    customerRole?: CustomerRoleSystemName
  ): Promise<ICustomer> {
    return new Promise(async (resolve, reject) => {
      if (!email) {
        email = await this.customerSettingSvc.getCurrentCustomerEmail();
      }

      email = email.toLowerCase();
      let customer = await this.dbService.get<ICustomer>(
        this.schemaSvc.tables.customer,
        email
      );
      if (customerRole) {
        const cr = customer.customerRoles.filter(
          (c) => c.systemName == customerRole
        );
        if (!cr.length) {
          resolve(email);
          return;
        }
      }

      resolve(customer);
    });
  }

  getAndSetGuestCustomer(token?) {
    return this.getData<ICustomer>('Customer/GetGuestCustomer').then(
      async (gc) => {
        gc.email = gc.customerGuid;
        //guests don't have email...
        await this.customerSettingSvc.putCurrentCustomerEmail(gc.email);
        await this.putCustomerLocal(gc);
        return gc;
      }
    );
  }

  putCustomerLocal(customer: ICustomer) {
    return this.dbService.putLocal(this.schemaSvc.tables.customer, customer);
  }

  async register(customer) {
    return this.postData({
      url: `Customer/Register`,
      body: customer,
    });
  }
}
