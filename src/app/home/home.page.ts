import { Component } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AllserveService } from '../services/allserve.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


team:any ={};




  constructor(public loadingController:LoadingController,public serve:AllserveService,private authService: AuthService,private router: Router) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'please wait...',
      duration: 2000
    });
    await loading.present();

    await loading.onDidDismiss().then(role=>{
      this.serve.randomfixture(this.q1,this.q2);
    });

    console.log('Loading dismissed!');
  }

ngOnInit()
{
  this.presentLoading();
  firebase.firestore().collection('participants').where("whr","==",'home').orderBy('randomnum','desc').get().then(val=>{
    val.forEach(res=>{
      
      console.log({...{id:res.id},...res.data()});
this.q1.push({...{id:res.id},...res.data()});

console.log(this.q1)
      
    })
  })

  firebase.firestore().collection('participants').where("whr","==",'away').orderBy('randomnum','asc').get().then(val=>{
    val.forEach(res=>{
      console.log({...{id:res.id},...res.data()})
      this.q2.push({...{id:res.id},...res.data()});
      console.log(this.q2)
    })
  })


}

  log(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });
    this.router.navigate(['setfixtures']);
  }

q1 =[];
q2 =[];

  setfix(x)
  {
    console.log(x)

    
  this.router.navigate(['fixtures']);
  }

  currtourn()
  {
this.router.navigate(['currtourn']);

  }


}
