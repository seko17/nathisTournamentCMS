import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrtournPageRoutingModule } from './currtourn-routing.module';

import { CurrtournPage } from './currtourn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrtournPageRoutingModule
  ],
  declarations: [CurrtournPage]
})
export class CurrtournPageModule {}
