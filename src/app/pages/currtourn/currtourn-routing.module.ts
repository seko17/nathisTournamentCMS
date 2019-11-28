import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrtournPage } from './currtourn.page';

const routes: Routes = [
  {
    path: '',
    component: CurrtournPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrtournPageRoutingModule {}
