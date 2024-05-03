import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthOptionsPageRoutingModule } from './auth-options-routing.module';

import { AuthOptionsPage } from './auth-options.page';
import { ComponentsWithFormsModule } from 'src/app/components/components-with-forms.module';

@NgModule({
  imports: [
    ComponentsWithFormsModule,
    AuthOptionsPageRoutingModule,
  ],
  declarations: [AuthOptionsPage]
})
export class AuthOptionsPageModule {}
