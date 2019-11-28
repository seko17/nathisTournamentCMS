import { LandingPagePage } from './../pages/landing-page/landing-page.page';
import { SetfixturesPage } from './../pages/setfixtures/setfixtures.page';
import { LandingPagePageModule } from './../pages/landing-page/landing-page.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    
  ],
  declarations: [HomePage, SetfixturesPage, LandingPagePage]
})
export class HomePageModule {}
