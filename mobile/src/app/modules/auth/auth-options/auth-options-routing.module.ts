import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthOptionsPage } from './auth-options.page';

const routes: Routes = [
  {
    path: '',
    component: AuthOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthOptionsPageRoutingModule {}
