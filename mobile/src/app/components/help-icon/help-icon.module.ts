import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes/pipes.module';
import { HelpIconComponent } from './help-icon.component';

@NgModule({
  imports: [PipesModule, IonicModule, CommonModule],
  declarations: [HelpIconComponent],

  exports: [HelpIconComponent],
})
export class HelpIconModule {}
