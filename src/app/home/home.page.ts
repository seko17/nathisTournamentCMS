import { Component } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


team:any ={};




  constructor(private authService: AuthService,private router: Router) {}





  log(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });
    this.router.navigate(['setfixtures']);
  }



  setfix(x)
  {
    console.log(x)
    this.router.navigate(['setfixtures'])
  firebase.firestore().collection('participants').add(x).then(val=>{
    console.log(val)
  })
  }

}
