import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Match2woPageRoutingModule } from './match2wo-routing.module';

import { Match2woPage } from './match2wo.page';
import { MatchtwoModule} from 'src/app/shared/matchtwo/matchtwo.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Match2woPageRoutingModule
  ],
  providers: [MatchtwoModule]
})
export class Match2woPageModule {}
