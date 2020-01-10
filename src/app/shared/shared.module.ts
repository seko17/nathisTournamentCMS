import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragdropPage } from '../pages/dragdrop/dragdrop.page';
import { IonicModule } from '@ionic/angular';
import { Pipe, PipeTransform } from '@angular/core';
import { Directive } from '@angular/core';
@NgModule({
  declarations: [],
  providers:[ 
    DragdropPage
 ],
  imports: [
    CommonModule,
    IonicModule
  ],

  // exports: [
  //   DragdropPage
  // ]
  // declarations: [DragdropPage]
})
export class SharedModule { }
