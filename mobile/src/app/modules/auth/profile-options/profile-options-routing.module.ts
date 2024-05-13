import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileOptionsPage } from './profile-options.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileOptionsPageRoutingModule {}
