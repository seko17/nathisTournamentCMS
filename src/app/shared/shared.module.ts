import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragdropPage } from '../pages/dragdrop/dragdrop.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DragdropPage],
  imports: [
    CommonModule,
    IonicModule
  ],

  exports: [
    DragdropPage
  ]
  // declarations: [DragdropPage]
})
export class SharedModule { }
