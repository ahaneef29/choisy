import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes/pipes.module';
import { CalenderPopupComponent } from './calender-popup.component';

@NgModule({
  imports: [PipesModule, IonicModule, CommonModule],
  declarations: [CalenderPopupComponent],
  exports: [CalenderPopupComponent],
})
export class CalenderPopupModule {}
