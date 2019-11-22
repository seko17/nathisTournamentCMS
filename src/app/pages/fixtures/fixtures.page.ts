import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.page.html',
  styleUrls: ['./fixtures.page.scss'],
})
export class FixturesPage implements OnInit {

  constructor() { }
  q1 =[];
  q2 =[];
  ngOnInit() {
   this. q1 =[];
    this.q2 =[];

    firebase.firestore().collection('Fixtures').where("quadrant","==",'q2').get().then(val=>{
      val.forEach(res=>{
      
        // console.log({... {id:res.id} ,...res.data()})
        this.q1.push({... {id:res.id} ,...res.data(),...{color: 'primary'}});
        console.log(this.q1)
      })
    })
    
    
    firebase.firestore().collection('Fixtures').where("quadrant","==","q1").get().then(val=>{
      val.forEach(res=>{
      
        // console.log({... {id:res.id} ,...res.data()})
        this.q2.push({... {id:res.id} ,...res.data(),...{color: 'secondary'}});
        console.log(this.q2)
      })
    }) 
  }

  savefixture(q1,q2)
  {

    console.log(q1,q2)
  }

}
