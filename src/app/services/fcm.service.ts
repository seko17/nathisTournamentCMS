import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { firebase } from '@firebase/app';
import '@firebase/messaging';
import { config } from '../FirebaseConfig';
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(  private toastController: ToastController) {

  }
  init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        navigator.serviceWorker.ready.then((registration) => {
            // Don't crash an error if messaging not supported
            if (!firebase.messaging.isSupported()) {
                   resolve();
                   return;
            }
            const messaging = firebase.messaging();
            // Register the Service Worker
            messaging.useServiceWorker(registration)
            // Initialize your VAPI key
            // messaging.usePublicVapidKey(
            //        config.vapidKey
            // );
            // Optional and not covered in the article
            // Listen to messages when your app is in the foreground
            messaging.onMessage((payload) => {
                console.log(payload);
            });
            // Optional and not covered in the article
            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                (refreshedToken: string) => {
                    console.log(refreshedToken);
                }).catch((err) => {
                    console.error(err);
                });
            });
            resolve();
        }, (err) => {
            reject(err);
        });
    });
  }
  requestPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => {
        if (!Notification) {
            resolve();
            return;
        }
        if (!firebase.messaging.isSupported()) {
            resolve();
            return;
        }
        try {
            const messaging = firebase.messaging();
            await messaging.requestPermission();
            const token: string = await messaging.getToken();
            console.log('User notifications token:', token);
        } catch (err) {
       console.log('error',err);   
        }
    resolve();
    });
}


}
