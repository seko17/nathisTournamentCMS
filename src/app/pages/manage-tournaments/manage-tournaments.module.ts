import { SetupMatchesPage } from './../setup-matches/setup-matches.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageTournamentsPageRoutingModule } from './manage-tournaments-routing.module';

import { ManageTournamentsPage } from './manage-tournaments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTournamentsPageRoutingModule
  ],
  declarations: [ManageTournamentsPage, SetupMatchesPage]
})
export class ManageTournamentsPageModule {}
