import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { IonicModule } from '@ionic/angular';

import { DragdropPageRoutingModule } from './dragdrop-routing.module';
import {SharedModule} from 'src/app/shared/shared.module'

import { DragdropPage } from './dragdrop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    IonicModule,
    DragdropPageRoutingModule
  ],
  declarations: [SharedModule]
})
export class DragdropPageModule {}
