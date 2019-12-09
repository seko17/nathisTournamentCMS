import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase'
// import { a } from '../environments/environment';
import { config } from '../app/FirebaseConfig';
import { FcmService } from './services/fcm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  //  messaging = firebase.messaging();
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationsService: FcmService, 
    public navCtrl: NavController
  ) {
    // this.initializeApp();
    // firebase.initializeApp(config);
  }
  async ngOnInit() {
    firebase.initializeApp(config);
    await this.notificationsService.init();
    
}
ngAfterViewInit() {
  this.platform.ready().then(async () => {
     await this.notificationsService.requestPermission();
  });
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
