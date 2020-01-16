import { Injectable } from '@angular/core';
import { AllserveService } from 'src/app/services/allserve.service';
import * as firebase from 'firebase';
import { Subscription, Observable, observable, timer } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Match2Service {

  constructor(public loadingController: LoadingController,public allserve: AllserveService, public alertController: AlertController, public serve: AllserveService) {

   }


ngOnInit()
{

}




currentmatch:any ={};
   secs =0;
mins =0;
sub:Subscription;
interval:any;

selectedmatch(x)
{

  console.log(x)
  this.currentmatch =x;
  console.log(this.currentmatch)
 this.currentmatch.mins =x.mins;
 this.currentmatch.secs =x.secs;
 this.mins =x.mins;
 this.secs =x.secs;
return this.currentmatch;
}


  firsthalf()
  {
   



    this.sub = timer(0, 1000).subscribe(result => {
     
   
console.log("first half")

      if (this.secs == 60) {
        this.secs = 0;
        this.mins = this.mins + 1;
        this.currentmatch.mins =this.mins;
      }

      this.secs = this.secs + 1;
      this.currentmatch.mins =this.secs;

    })

  }
  
  
  

stop()
{

  


}
}