import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [CommonModule, IonicModule, PipesModule],
  declarations: [],
  exports: [CommonModule, IonicModule, PipesModule],
})
export class ComponentsWithOutFormsModule {}
