import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerService } from './customer.service';

const routes: Routes = [];
@NgModule({
  providers: [CustomerService],
})
export class CustomerCommonModule {}
