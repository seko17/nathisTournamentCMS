import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AllserveService } from 'src/app/services/allserve.service';
@Component({
  selector: 'app-setfixtures',
  templateUrl: './setfixtures.page.html',
  styleUrls: ['./setfixtures.page.scss'],
})
export class SetfixturesPage implements OnInit {



  ngOnInit() {
    this.q1=[];
    this.q2 =[];
firebase.firestore().collection('participants').where("whr","==",'home').get().then(val=>{
  val.forEach(res=>{
  
    // console.log({... {id:res.id} ,...res.data()})
    this.q1.push({... {id:res.id} ,...res.data(),...{color: 'primary'}});
    console.log(this.q1)
  })
})


firebase.firestore().collection('participants').where("whr","==",'away').get().then(val=>{
  val.forEach(res=>{
  
    // console.log({... {id:res.id} ,...res.data()})
    this.q2.push({... {id:res.id} ,...res.data(),...{color: 'secondary'}});
    console.log(this.q1)
  })
})
  }

  q1 = [];
  q2 = [];

 
  todo = { value: '', color: '' };
  selectedQuadrant = 'q1';
 
  constructor(public alertController:AlertController,public serve:AllserveService,private router:Router,private dragulaService: DragulaService, private toastController:ToastController) {
    
    //code for drag and drop
    
    this.dragulaService.drag('bag')
    .subscribe(({ name, el, source }) => {
      el.setAttribute('color', 'dark');
    });
 
    this.dragulaService.removeModel('bag')
    .subscribe(({ item }) => {


      
      this.toastController.create({
        message: 'Removed: ' + item.value,
        duration: 2000
      }).then(toast => toast.present());
    });
 

    //when object is dropped,this is the function that listens
    this.dragulaService.dropModel('bag')
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
 

  async savefixture()
  {
    console.log("Q1 = ",this.q1);
    console.log("Q2 =",this.q2);
//if fixtures are not equal in assignment
this.serve.fixture =[];

this.serve.randomfixture(this.q1,this.q2);
    if(this.q1.length != this.q2.length)
    {
console.log("Fixtures not correct")
const alert = await this.alertController.create({
  header: 'Alert',
  subHeader: 'Subtitle',
  message: 'This is an alert message.',
  buttons: ['OK']
});
    }


      this.router.navigate(['fixtures']);
   

  }
ionViewWillLeave()
{
  this.dragulaService.destroy('bag');
}
}
