import { SetupMatchesPage } from './../setup-matches/setup-matches.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DragulaModule } from "ng2-dragula"
import { IonicModule } from '@ionic/angular';
import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ManageTournamentsPageRoutingModule } from './manage-tournaments-routing.module';

import { ManageTournamentsPage } from './manage-tournaments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTournamentsPageRoutingModule,
    DragulaModule.forRoot()
  ],
  //ManageTournamentsPage , SetupMatchesPage
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: []
})
export class ManageTournamentsPageModule {}
