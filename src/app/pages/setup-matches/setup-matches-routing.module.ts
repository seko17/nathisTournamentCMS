import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupMatchesPage } from './setup-matches.page';

const routes: Routes = [
  {
    path: '',
    component: SetupMatchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupMatchesPageRoutingModule {}
