import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  declarations: [],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
})
export class ComponentsWithFormsModule {}
