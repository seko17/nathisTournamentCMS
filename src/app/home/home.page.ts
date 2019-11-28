import { Component } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
// import {fcm} from 'fcm-notification';
// var FCM = new fcm('path/to/privatekey.json');
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private authService: AuthService,private router: Router) {}

  log(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });
  }
// send(){
//   let token = 'ejqZFghC6HTOlzkk0W4Wte:APA91bEPz_RsFyBm6QHuZVfE6Ge8724nFoC3SANubEa_OGHAsmcnk0Zc86tvvUvSLu5yVKYmdHZ3vbX8VpF9P1Ts9aIEUdC9nUvwDNhAQYtvnJcweojyyXydmr3YvdnWXyqQ1lE0-Jg9';
 
//     let message = {
//         data: {    //This is only optional, you can send any data
//             score: '850',
//             time: '2:45'
//         },
//         notification:{
//             title : 'Title of notification',
//             body : 'Body of notification'
//         },
//         token : token
//         };
 
// FCM.send(message, function(err, response) {
//     if(err){
//         console.log('error found', err);
//     }else {
//         console.log('response here', response);
//     }
// })
// }
}
