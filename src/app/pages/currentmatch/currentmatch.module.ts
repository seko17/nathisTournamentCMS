import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentmatchPageRoutingModule } from './currentmatch-routing.module';

import { CurrentmatchPage } from './currentmatch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrentmatchPageRoutingModule
  ],
  declarations: [CurrentmatchPage]
})
export class CurrentmatchPageModule {}
