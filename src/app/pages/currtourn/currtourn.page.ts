import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AllserveService } from 'src/app/services/allserve.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-currtourn',
  templateUrl: './currtourn.page.html',
  styleUrls: ['./currtourn.page.scss'],
})
export class CurrtournPage implements OnInit {

  constructor(public serve:AllserveService,public router:Router) { }
  fixture =[];
  obj:any ={};
    ngOnInit() {
  
      firebase.firestore().collection('MatchFixtures').get().then(res=>{
        res.forEach(val=>{
         
  
          let ndate = new Date(val.data().matchdate);
          
          this.obj =val.data();
          this.obj.matchtime =ndate.toLocaleTimeString();
  
  
          
          this.obj.matchdate=' '+ndate.toLocaleDateString();
          console.log(this.obj.matchdate)
          console.log("Time = ",ndate.toLocaleDateString())
          console.log({...this.obj,...{id:val.id}})
          this.fixture.push({...this.obj,...{id:val.id}})
        })
      })
    }
  


    stmatch(item)
    {
      console.log(item)
      this.serve.currentmatch =item;
      

      this.router.navigate(['currentmatch']);
      
    }
  }

