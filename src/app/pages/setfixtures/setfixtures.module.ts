import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DragulaModule } from 'ng2-dragula';
import { SetfixturesPageRoutingModule } from './setfixtures-routing.module';

import { SetfixturesPage } from './setfixtures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    IonicModule,
    SetfixturesPageRoutingModule
  ],
  // SetfixturesPage
  declarations: []
})
export class SetfixturesPageModule {}
