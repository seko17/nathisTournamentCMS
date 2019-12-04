import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupMatchesPageRoutingModule } from './setup-matches-routing.module';

import { SetupMatchesPage } from './setup-matches.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupMatchesPageRoutingModule
  ],
  // /SetupMatchesPage
  declarations: []
})
export class SetupMatchesPageModule {}
