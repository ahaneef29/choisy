import { Injectable } from '@angular/core';
import { BaseService } from '../universal/base.service';
import { CustomerRoleSystemName, ICustomer } from './customer.model';
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

  async register(customer: IRegistrationParams) {
    return this.postData<string>({
      url: `Customer/Register`,
      body: customer,
    });
  }
}
