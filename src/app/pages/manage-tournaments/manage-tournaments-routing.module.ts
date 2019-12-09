import { IonicModule } from '@ionic/angular';
import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';
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
    ReactiveFormsModule,
    DragulaModule
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations:[]
})
export class ManageTournamentsPageRoutingModule { }
                      