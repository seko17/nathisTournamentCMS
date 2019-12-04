import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageTournamentsPage } from './manage-tournaments.page';
import { FormsModule, ReactiveFormsModule, NgControlStatus, ControlContainer } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ManageTournamentsPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  declarations:[]
})
export class ManageTournamentsPageRoutingModule { }
                      