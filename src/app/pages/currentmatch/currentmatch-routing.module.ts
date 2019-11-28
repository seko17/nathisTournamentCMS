import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentmatchPage } from './currentmatch.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentmatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentmatchPageRoutingModule {}
