import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileOptionsPageRoutingModule } from './profile-options-routing.module';

import { ProfileOptionsPage } from './profile-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileOptionsPageRoutingModule
  ],
  declarations: [ProfileOptionsPage]
})
export class ProfileOptionsPageModule {}
