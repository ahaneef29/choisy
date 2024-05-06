import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule, PipesModule],
  declarations: [],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule, PipesModule],
})
export class ComponentsWithFormsModule {}
