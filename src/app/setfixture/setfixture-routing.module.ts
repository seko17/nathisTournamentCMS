import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetfixturePage } from './setfixture.page';

const routes: Routes = [
  {
    path: '',
    component: SetfixturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetfixturePageRoutingModule {}
