import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetfixturesPage } from './setfixtures.page';

const routes: Routes = [
  {
    path: '',
    component: SetfixturesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetfixturesPageRoutingModule {}
