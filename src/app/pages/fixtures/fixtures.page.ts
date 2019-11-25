import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AllserveService } from 'src/app/services/allserve.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.page.html',
  styleUrls: ['./fixtures.page.scss'],
})
export class FixturesPage implements OnInit {

  constructor(public serve:AllserveService,public loadingController: LoadingController,public toastController:ToastController,private router: Router) { }
  q1 =[];
  q2 =[];
  fixture =[];
  ngOnInit() {
    
   
 
    
  }

 

  async savefixture(q1)
  {

    console.log(q1)

 
      for(let r =0;r<q1.length;r++)
      {
let z:any ={};
z ={...q1[r],random1:Math.floor((Math.random() * r) *2),random2:Math.floor((Math.random() * r) +3),matchtime:"00:00"};


       console.log("Tdate =",z);



   if(z.matchdate==undefined)
    {
      const toast = await this.toastController.create({
        message: 'Enter the time and date for all the matches.',
        duration: 2000
      });
      toast.present();  
    }

    else
    {
    firebase.firestore().collection('MatchFixtures').add(z).then(val=>{
      console.log(val)
    })

    const toast = await this.toastController.create({
      message: 'Fixture saved successfully.',
      duration: 2000
    });
    toast.present();  
    this.router.navigate(['home']);
    }
 
    
      }

      
    
      


  }



async presentLoading() {

  

  const loading = await this.loadingController.create({
    message: 'Setting Fixtures',
    duration: 4000
  });
  await loading.present();

    await loading.onDidDismiss().then(val=>{
    
    
      this.fixture =this.serve.fixture;

      console.log("Serve Array = ",this.fixture)
  
  })

  console.log('Loading dismissed!');
}


  ionViewWillEnter()
  {
 
    this.presentLoading();
    
   
  }


  ManualFix()
  {
    this.router.navigate(['setfixtures'])

  }
}
