import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase'
// import { a } from '../environments/environment';
import { config } from '../app/FirebaseConfig';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController
  ) {
    this.initializeApp();
    firebase.initializeApp(config)
  }

  initializeApp() {
   setTimeout(() => {
     firebase.auth().onAuthStateChanged(user => {
       if (user) {
        //  {skipLocationChange: true,}
        this.navCtrl.navigateRoot('home');
        console.log('signed in');
        
       } else {
        this.navCtrl.navigateRoot('login');
        console.log('signed out');
       }
      
     })
   }, 0);
 
  }
}
