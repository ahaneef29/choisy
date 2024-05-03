import { Component, OnInit } from '@angular/core';
import { BasePage } from '../modules/universal/base.page';
import { CustomerSettingService } from '../modules/customer/customer-setting.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BasePage implements OnInit  {

  constructor(
    private cutomerSettingSvc: CustomerSettingService
  ) {
    super();
  }
  async ngOnInit(){

    ''
  }

  async onTabClicked(tabs: string) {
    await this.cutomerSettingSvc.canActivate();
  }
    

}
