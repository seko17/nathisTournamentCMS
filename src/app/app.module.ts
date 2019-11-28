import { LandingPagePageModule } from './pages/landing-page/landing-page.module';
import { SetUpMatchesComponent } from './components/set-up-matches/set-up-matches.component';
import { MembersComponent } from './components/members/members.component';
import { ManageNewTournamentsComponent } from './components/manage-new-tournaments/manage-new-tournaments.component';
import { ManageApplicationsComponent } from './components/manage-applications/manage-applications.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DragulaModule } from 'ng2-dragula';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { SetUpFixturesComponent } from './components/set-up-fixtures/set-up-fixtures.component';

@NgModule({
  declarations: [AppComponent,ManageApplicationsComponent, LandingPageComponent, ManageNewTournamentsComponent, MembersComponent,SetUpFixturesComponent,SetUpMatchesComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    DragulaModule.forRoot(), LandingPagePageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
