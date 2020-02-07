import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, LoadingController } from '@ionic/angular';
import '@firebase/messaging';

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.page.html',
  styleUrls: ['./manage-members.page.scss'],
})
export class ManageMembersPage implements OnInit {
  // CSS Properties __________________________________
    // dummy array to test css overflow-x or -y
    tempCardGen = []
    // _______________________________________________

    db = firebase.firestore()
    vendors =[]
    manager = []
    approvedVendor = []
    approvedManagers = []
    arr = [4,4,5,5,5,5,6,2,3,4,5,6,7,8,9,0,9,8,7,6,5,4,3,23,2]
  constructor(public alertController: AlertController,
    public loadingController: LoadingController) { }

  ngOnInit() {
    while (this.tempCardGen.length < 20) {
      let int = 0
      let counter = int + 1;
      this.tempCardGen.push('card', counter)
    }

    this.getUnapprovedMembers();
    this.getApprovedMembers();
  }
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
      message: 'Please wait...',
    });
    return await loading.present();
  }

async approve(val){
console.log('fore',val.docid);

  const alert = await this.alertController.create({   
    header: 'Please Confirm!',
    message: 'Are you sure you want to Approve '+ val.doc.form.fullName +' to be part of Nathis Tournament',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        handler: () => {
          this.db.collection('members').doc(val.docid).update({status : 'accepted'}).then(res =>{
          
            this.presentLoading()
          }).catch(err =>{
            console.log(err);
            
          })
        }
      }
    ]
  });
  await alert.present();
  }
  async decline(val){
    console.log('fore',val.docid);
    
      const alert = await this.alertController.create({   
        header: 'Please Confirm!',
        message: 'Are you sure you want to Decline '+ val.doc.form.fullName +'.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              this.db.collection('members').doc(val.docid).update({status : 'declined'}).then(res =>{
              
                this.presentLoading()
              }).catch(err =>{
                console.log(err);
                
              })
            }
          }
        ]
      });
      await alert.present();
      }
getUnapprovedMembers(){
  let obj = {
    docid: null,
    doc: null,
  }
this.db.collection('members').where('status', '==','awaiting').onSnapshot(res =>{
  this.vendors = []
  this.manager = []
  res.forEach(doc =>{
    // console.log('data', doc.data().form.role);
    if(doc.data().form.role =='teamManager'){
      obj = {
        docid : doc.id,
        doc: doc.data()
      }
      this.manager.push(obj)
      console.log('manager', this.manager);
      
    }else if (doc.data().form.role =='vendor'){
      obj = {
        docid : doc.id,
        doc: doc.data()
      }
      this.vendors.push(obj)
      console.log('vendors',this.vendors);
      
    }
  })
})
}
getApprovedMembers(){
  this.db.collection('members').where('status', '==','accepted').onSnapshot(res =>{
   this. approvedVendor = []
    this.approvedManagers = []
    res.forEach(doc =>{
      // console.log('data', doc.data().form.role);
      if(doc.data().form.role =='teamManager'){
        this.approvedManagers.push({...{docid:doc.id},...doc.data()})
        console.log('approvedManagers', this.approvedManagers);
      }else if (doc.data().form.role =='vendor'){
        this.approvedVendor.push(doc.data())
        console.log('approvedVendor',this.approvedVendor);
        
      }
    })
  })
}
save(){
  
  let obj = 'save'
  this.db.collection('test').doc().set({obj});
  
}


async block(item)
{
 console.log(item) 



const alert = await this.alertController.create({
  header:'Block or Unblock ?',
  subHeader: item.form.fullName,
  inputs: [
    {
      name: 'radio1',
      type: 'radio',
      label: 'Unblock',
      value: 'Unblock',
      checked: true
    },
    {
      name: 'radio2',
      type: 'radio',
      label: 'Block',
      value: 'Block'
    }
  ],
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Confirm Cancel');
      }
    }, {
      text: 'Ok',
      handler: (data) => {
        console.log(data);
        firebase.firestore().collection('members').doc(item.docid).update({status:data});
      }
    }
  ]
});

await alert.present();


}


}
