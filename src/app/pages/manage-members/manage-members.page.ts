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
  vendors = []
  manager = []
  approvedVendor = []
  approvedManagers = []
  arr = [4, 4, 5, 5, 5, 5, 6, 2, 3, 4, 5, 6, 7, 8, 9, 0, 9, 8, 7, 6, 5, 4, 3, 23, 2]
  // variables for searching
  tempmanager = []
  tempapprovedManagers = []
  tempvendors = []
  tempapprovedVendor = []
  // ====
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

  async approve(val) {
    console.log('fore', val.docid);

    const alert = await this.alertController.create({
      header: 'Please Confirm!',
      message: 'Are you sure you want to Approve ' + val.doc.form.fullName + ' to be part of Nathis Tournament',
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
            this.db.collection('members').doc(val.docid).update({ status: 'accepted' }).then(res => {

              this.presentLoading()
            }).catch(err => {
              console.log(err);

            })
          }
        }
      ]
    });
    await alert.present();
  }
  async decline(val) {
    console.log('fore', val.docid);

    const alert = await this.alertController.create({
      header: 'Please Confirm!',
      message: 'Are you sure you want to Decline ' + val.doc.form.fullName + '.',
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
            this.db.collection('members').doc(val.docid).update({ status: 'declined' }).then(res => {

              this.presentLoading()
            }).catch(err => {
              console.log(err);

            })
          }
        }
      ]
    });
    await alert.present();
  }
  getUnapprovedMembers() {
    let obj = {
      docid: null,
      doc: null,
    }
    this.db.collection('members').where('status', '==', 'awaiting').onSnapshot(res => {
      this.vendors = []
      this.manager = []
      res.forEach(doc => {
        console.log('data', doc.data());
        if (doc.data().form.role == 'teamManager') {
          obj = {
            docid: doc.id,
            doc: doc.data()
          }
          this.manager.push(obj)
          console.log('manager', this.manager);

        } else if (doc.data().form.role == 'vendor') {
          obj = {
            docid: doc.id,
            doc: doc.data()
          }
          this.vendors.push(obj)
          console.log('vendors', this.vendors);

        }
      })
      // populate the temps after getting the main's data LEAVE THESE ALONE
      this.tempmanager = this.manager
      this.tempvendors = this.vendors
    })
  }
  getApprovedMembers() {
    this.db.collection('members').where('status', '==', 'accepted').onSnapshot(res => {
      this.approvedVendor = []
      this.approvedManagers = []
      res.forEach(doc => {
        // console.log('data', doc.data().form.role);
        if (doc.data().form.role == 'teamManager') {
          this.approvedManagers.push({ ...{ docid: doc.id }, ...doc.data() })
          console.log('approvedManagers', this.approvedManagers);
        } else if (doc.data().form.role == 'vendor') {
          this.approvedVendor.push(doc.data())
          console.log('approvedVendor', this.approvedVendor);

        }
      })
      // populate the temps after getting the main's data LEAVE THESE ALONE
      this.tempapprovedManagers = this.approvedManagers
      this.tempapprovedVendor = this.approvedVendor
    })
  }
  save() {

    let obj = 'save'
    this.db.collection('test').doc().set({ obj });

  }
  onSearchManagers(event) {
    // arrays to filter
    // manager
    // approvedManagers
    // i want to manipulate the mains while using temps as backup
    let val = event.detail.value

    // filtering of new applications
    if (val && val.trim() != "") {
      this.manager = this.tempmanager.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });

    } else if (val != " ") {
      this.manager = this.tempmanager.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (val == "") {
      this.manager = this.tempmanager;
    }

    // filtering of existing manaagers
    if (val && val.trim() != "") {
      this.approvedManagers = this.tempapprovedManagers.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (val != " ") {
      this.approvedManagers = this.tempapprovedManagers.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (val == "") {
      this.approvedManagers = this.tempapprovedManagers;
    }
  }
  onSearchVendors(event) {
    // arrays to filter
    // vendors
    // approvedVendor

    let val = event.detail.value

    // filtering of new applications
    if (val && val.trim() != "") {
      this.vendors = this.tempvendors.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });

    } else if (val != " ") {
      this.vendors = this.tempvendors.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (val == "") {
      this.vendors = this.tempvendors;
    }

    // filtering of existing manaagers
    if (val && val.trim() != "") {
      this.approvedVendor = this.tempapprovedVendor.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (val != " ") {
      this.approvedVendor = this.tempapprovedVendor.filter(item => {
        return item.form.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (val == "") {
      this.approvedVendor = this.tempapprovedVendor;
    }
  }
  async block(item) {
    console.log(item)
    const alert = await this.alertController.create({
      header: 'Block or Unblock ?',
      subHeader: item.form.fullName,
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Unblock',
          value: 'Unblocked',
          checked: item.status2 == "Unblocked" ? true : false
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Block',
          value: 'Blocked',
          checked: item.status2 == 'Blocked' ? true : false
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
            firebase.firestore().collection('members').doc(item.docid).update({ status2: data });
          }
        }
      ]
    });

    await alert.present();


  }


}
