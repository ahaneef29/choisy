import { NgModule } from '@angular/core';

import { LocalizedResourcePipe } from './localizedRresource.pipe';
import { SafePipe } from './safe.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LocalizedResourcePipe, SafePipe],
  imports: [CommonModule],
  providers: [],
  exports: [LocalizedResourcePipe, SafePipe],
})
export class PipesModule {}
