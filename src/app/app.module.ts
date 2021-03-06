import { LandingPagePageModule } from './pages/landing-page/landing-page.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DragulaModule } from 'ng2-dragula';
import { AppComponent } from './app.component';
import {Match2woPage} from '../app/pages/match2wo/match2wo.page';
import { AppRoutingModule } from './app-routing.module';
import { SetfixturesPage } from './pages/setfixtures/setfixtures.page';
import { SetfixturePage } from './setfixture/setfixture.page';
import { DragdropPage } from './pages/dragdrop/dragdrop.page';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
// import {SharedModule} from './shared/shared.module'

@NgModule({
  declarations: [AppComponent,SetfixturesPage,DragdropPage,Match2woPage],
  entryComponents: [SetfixturesPage,DragdropPage,Match2woPage],
  // GooglePlaceModule
  imports: [ BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    DragulaModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  exports: [
    SetfixturesPage
  ]
  
})
export class AppModule {}
