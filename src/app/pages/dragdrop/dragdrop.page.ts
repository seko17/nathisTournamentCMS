import { Component, OnInit, Renderer2 } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AllserveService } from 'src/app/services/allserve.service';
import {} from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.page.html',
  styleUrls: ['./dragdrop.page.scss'],
})
export class DragdropPage implements OnInit {


  q1 = [];
  q2 = [];


  todo = { value: '', color: '' };
  selectedQuadrant = 'q1';


  async ngOnInit() {
    this.q1 = [];
    this.q2 = [];
   let num =0;
console.log(this.serve.tournid)
    const loading = await this.loadingController.create({
     spinner:'bubbles',
      duration: 2000
    });
    await loading.present();

loading.onDidDismiss().then(res=>{

  firebase.firestore().collection('participants').where("tournid", "==", this.serve.tournid).get().then(val => {
    val.forEach(res => {


console.log(res.data())

num =num+1;
      if(num%2 ==0)
      {
        this.q1.push({ ... { id: res.id }, ...res.data()});
      }
    else if(num%2 ==1)
    {
      this.q2.push({ ... { id: res.id }, ...res.data()});
    }
      
      
    })
  })



})

  

   
  }

  constructor(public loadingController:LoadingController,public modalcontroller:ModalController,public alertController: AlertController, public serve: AllserveService, private router: Router, private dragulaService: DragulaService, private toastController: ToastController, public renderer: Renderer2) {

    //code for drag and drop

    this.dragulaService.drag('bag')
      .subscribe(({ name, el, source }) => {
        el.setAttribute('color', 'light');   
      });

    this.dragulaService.removeModel('bag')
      .subscribe(({ item }) => {
        this.toastController.create({
          message: 'Removed: ' + item.value,
          duration: 2000
        }).then(toast => toast.present());
      });
      this.dragulaService.dropModel('bag').subscribe(({item, sourceIndex}) => {
        console.log(item,sourceIndex);
        
      })
      this.dragulaService.drop('bag')
      .subscribe(({ name, el, source }) => {
        el.setAttribute('color', 'light');
      });
    // when object is dropped,this is the function that listens
    this.dragulaService. dropModel('bag')
      .subscribe(({ item }) => {
        item['color'] = 'success';
        console.log(item)


      });

    this.dragulaService.createGroup('bag', {
      removeOnSpill: false
    });
  }

  addTodo() {
    switch (this.selectedQuadrant) {
      case 'q1':
        this.todo.color = 'primary';
        break;
      case 'q2':
        this.todo.color = 'secondary';
        break;
      case 'q3':
        this.todo.color = 'tertiary';
        break;
      case 'q4':
        this.todo.color = 'dark';
        break;
    }
    this[this.selectedQuadrant].push(this.todo);
    this.todo = { value: '', color: '' };
  }


  async savefixture(q1,q2) {
    console.log("Q1 = ", q1);
    console.log("Q2 =", q2);
   let temp =[];
let fixture =[];
    for(let c =0;c<=this.q1.length;c++)
    {

      // temp.push({ ...q1[c],...q2[c], ...{score:0, matchdate: null, goal: 0, whr: 'away', aoffsides: 0, acorners: 0, mins: 0, secs: 0, ayellow: 0, ared: 0, offsides: 0, corners: 0, yellow: 0, red: 0 } });


     


let away:any ={
aTeamObject:q2[c].TeamObject,
awhr:q2[c].whr
}

console.log("away = ",away)

fixture.push({...q1[c],...away,...{matchstate:'incomplete'}});

console.log("Fixture variable = ",fixture)
    }




  }
  ionViewWillLeave() {
    this.dragulaService.destroy('bag');
  }
}
