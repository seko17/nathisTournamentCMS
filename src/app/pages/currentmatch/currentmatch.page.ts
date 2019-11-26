import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subscription, Observable, observable,timer } from 'rxjs';
import { LoadingController, IonicModule, Platform, AlertController } from '@ionic/angular';
import { AllserveService } from 'src/app/services/allserve.service';
@Component({
  selector: 'app-currentmatch',
  templateUrl: './currentmatch.page.html',
  styleUrls: ['./currentmatch.page.scss'],
})
export class CurrentmatchPage implements OnInit {
currentmatch =[];
timer;
docid;
mins =0;
sub :Subscription;
btntxt1 ="First Half";
btntxt2 ="Second Half";
btn1 =false;
btn2 =true;
  constructor(public alertController: AlertController,public plt:Platform,public serve:AllserveService,public router:Router) {





    firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{

    this.score =val.data().score;
    this.ascore =val.data().ascore;
    this.tourname =val.data().Tournament;
      if(val.data().mins>0&&val.data().mins<=46)
      {
       this.btntxt1 ="Resume First Half";
      }
      else  if(val.data().mins>0&&val.data().mins<=90)
      {
        this.btntxt2 ="Resume Second Half";
      }



              
              
         })
      
      

   }

  ngOnInit() {

  }

ionViewWillEnter()
{
  this.currentmatch.push(this.serve.currentmatch);
  console.log("currentmatch = ",this.currentmatch);
}




firsthalf()
{
  this.btn1 =true;
  this.btn2 =true;
  
    this.sub = timer(0,1000).subscribe(result =>{
     


console.log('docid = ',this.serve.currentmatch.id)

      firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{

    
this.timer =val.data().timer;
        console.log(val.data().timer)
        this.mins=val.data().mins   
        if(this.timer==59)
        {
this.timer =0;
this.mins=this.mins+1;

        }


 firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({timer:this.timer+1,mins:this.mins});
      })
  
  
  
    })









   



}

async stop()
{

  const alert = await this.alertController.create({
    header: 'Confirm!',
    message: 'Ae you sure you want to stop the match?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'YES',
        handler: () => {
          this.btn1 =true;
          this.btn2 =false;
          this.sub.unsubscribe();
          console.log(this.sub.unsubscribe())
        }
      }
    ]
  });

  await alert.present();






 
}

secondhalf()
{
  this.btn1 =true;
  this.btn2 =true;
  this.sub = timer(0,1000).subscribe(result =>{
     


    console.log('docid = ',this.serve.currentmatch.id)
    
          firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{
    
    this.timer =val.data().timer;
            console.log(val.data().timer)
            
            if(this.timer==59)
            {
    this.timer =0;
    this.mins=this.mins+1;
    
            }
    
    
            firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({timer:this.timer+1,mins:this.mins});
          })
      
      
      
        })
    
    
    
    
    



}



async ionViewWillLeave()
{
  const alert = await this.alertController.create({
    header: 'Alert',
    subHeader: 'Warning!',
    message: 'Leaving this page during a match will pause any ongoing matches!',
    buttons: ['OK']
  });

  await alert.present();
  this.sub.unsubscribe();
}

score;
ascore;
tourname;
id;
goal1()
{
console.log("click",this.tourname);
  firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
    val.forEach(res=>{
      this.score =res.data().score;
      console.log(res.data())
      this.id =res.id;
      console.log( this.id)
      firebase.firestore().collection('Top4').doc(this.id).update({score:this.score+1,scoretime:this.mins.toString()+this.timer.toString()});

    })
    
})
firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({score:this.score+1});

           
    

      
}


goal2()
{
  console.log("click",this.tourname);
  firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
    val.forEach(res=>{
      this.ascore =res.data().ascore;
      console.log(res.data())
      this.id =res.id;
      console.log( this.id)
      firebase.firestore().collection('Top4').doc(this.id).update({ascore:this.ascore+1,scoretime:this.mins.toString()+this.timer.toString()});

    })
    
            })
            firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({ascore:this.ascore+1});
}
}
