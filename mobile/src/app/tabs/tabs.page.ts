import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { BasePage } from '../modules/universal/base.page';
import { CustomerSettingService } from '../modules/customer/customer-setting.service';
import { ICustomer } from '../modules/customer/customer.model';
import { CustomerConstant } from '../modules/customer/customer-constant';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BasePage implements OnInit  {
  currentCustomer!: ICustomer;

  private _subscriptions = new Subscription();

  constructor(
    private cutomerSettingSvc: CustomerSettingService
  ) {
    super();

    this._subscriptions.add(
      this.pubsubSvc.subscribe(CustomerConstant.EVENT_CUSTOMER_LOGGEDIN, ({ user }) => {
        this.currentCustomer = user;
      })
    );
  }
  async ngOnInit(){
    ''
  }

  async onTabClicked(tabs: string) {
    await this.cutomerSettingSvc.canActivate();
  }
    

}
