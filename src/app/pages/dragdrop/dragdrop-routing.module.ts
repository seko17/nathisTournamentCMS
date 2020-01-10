import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragdropPage } from './dragdrop.page';

const routes: Routes = [
  {
    path: '',
    component: DragdropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DragdropPageRoutingModule {}
