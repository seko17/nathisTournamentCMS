import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Match2woPage } from './match2wo.page';

const routes: Routes = [
  {
    path: '',
    component: Match2woPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Match2woPageRoutingModule {}
