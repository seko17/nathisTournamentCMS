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
sub :Subscription;
  constructor(public plt:Platform,public serve:AllserveService,public router:Router) {

    this.plt.ready().then(() =>{
      this.sub = timer(0,10).subscribe(result =>{
       






console.log('docid = ',this.serve.currentmatch.id)

        firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{

          // val.forEach(res=>{
          //   console.log({id:res.id,...res.data()})
          //   this.timer=res.data();
          //   this.docid =res.id;
          //   console.log("time = ",this.timer)
          // })
          // console.log(val.data())
this.timer =val.data().timer;
          console.log(val.data().timer)

          firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({timer:this.timer+1});
        })
    
    
    
        









      }
      )})




   }

  ngOnInit() {

  }

ionViewWillEnter()
{
  this.currentmatch.push(this.serve.currentmatch);
  console.log("currentmatch = ",this.currentmatch);
}


}
