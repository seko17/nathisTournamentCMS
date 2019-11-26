import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subscription, Observable, observable,timer } from 'rxjs';
import { LoadingController, IonicModule, Platform } from '@ionic/angular';
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
  constructor(public plt:Platform,public serve:AllserveService,public router:Router) {

    firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{

    
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
        
        if(this.timer==59)
        {
this.timer =0;
this.mins=this.mins+1;

        }


        firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({timer:this.timer+1,mins:this.mins});
      })
  
  
  
    })









   



}

stop()
{
  this.btn1 =true;
  this.btn2 =false;
  this.sub.unsubscribe();
  console.log(this.sub.unsubscribe())
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






}
