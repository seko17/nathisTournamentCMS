import { firebase } from '@firebase/app';
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as fire from "firebase";
// import { a } from '../environments/environment';
import { config } from '../app/FirebaseConfig';
import { FcmService } from './services/fcm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // db = fire.firestore()
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
     this.initializeApp()
  });
}
  initializeApp() {
   setTimeout(() => {
     fire.auth().onAuthStateChanged(user => {
       if (user) {
        //  {skipLocationChange: true,}
        fire.firestore().collection('CMS_Profile').doc(fire.auth().currentUser.uid).get().then(res => {
          console.log('login res', res);
          
          if (res.exists) {
            this.navCtrl.navigateRoot('home')
            console.log('exists');
            
          }
        })
        console.log('signed in');
        
       } else {
        this.navCtrl.navigateRoot('login');
        console.log('signed out');
       }
      
     })
   }, 0);
 
  }

}
