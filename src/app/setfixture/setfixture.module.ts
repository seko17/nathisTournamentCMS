import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetfixturePageRoutingModule } from './setfixture-routing.module';

import { SetfixturePage } from './setfixture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetfixturePageRoutingModule
  ],
  declarations: [SetfixturePage]
})
export class SetfixturePageModule {}
