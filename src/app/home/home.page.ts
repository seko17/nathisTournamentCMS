import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AllserveService } from '../services/allserve.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { async } from 'q';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // CSS Classes & properties__________________
  // changes the view when clickign the side panel navigation
  screen = {
    main: true,
    tournaments: false,
    members: false
  }
  openProfile = false;
  adminProfile = {
    formInfo: {
      fullName: null,
      number: null
    },
    image: null
    
  } as PROFILE
  editProfile = {
    formInfo: {
      fullName: null,
      number: null
    },
    image: null
  } as PROFILE
  profileDiv = document.getElementsByClassName('profile-more')
  editDiv = document.getElementsByClassName('editProfile')
  editMode = false
  creatingProfile = false
  uploadProgress = 0
  // BEGIN BACKEND HERE______________________________


  // reference to firestore
  db = firebase.firestore()

  // reference to storage
  storage = firebase.storage().ref()

  // form for new tournament
  newTournForm: FormGroup;

  // contains data for the new tournament
  tournamentObj = {
    formInfo: null,
    approved: false,
    approvedVendors: [],
    dateCreated: null,
    sponsors: [],
    state: 'newTournament',

  }

  // contains tournament information for Viewing
  viewTournament = {}

  team: any = {};

  // q1
  home = [];
  // q2
  away = [];

  // dummy array to test css overflow-x or -y
  tempCardGen = []
  // like it says
  validationMessages = {
    valid: [
      { type: 'required', message: 'Field required.' },
      { type: 'minlength', message: 'Field must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Field cannot be more than 25 characters long.' },
    ]
  }


  // 
  tournaments = []
  tournamentsToDisplay = []
  constructor(public alertController: AlertController, public loadingController: LoadingController, public serve: AllserveService, private authService: AuthService, private router: Router, public navCtrl: NavController, public renderer: Renderer2, public formBuilder: FormBuilder, public alertCtrl: AlertController) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'please wait...',
      duration: 100
    });
    await loading.present();

    await loading.onDidDismiss().then(role => {
      this.serve.randomfixture(this.home, this.away);
    });

    console.log('Loading dismissed!');
  }

  ngOnInit() {
    // add dummy teams
    console.log('home loaded');

    this.getCMSUserProfile();
    while (this.tempCardGen.length < 20) {
      let int = 0
      let counter = int + 1;
      this.tempCardGen.push('card', counter)
    }
    this.presentLoading();
    firebase.firestore().collection('participants').where("whr", "==", 'home').orderBy('randomnum', 'desc').get().then(val => {
      val.forEach(res => {

        console.log({ ...{ id: res.id }, ...res.data() });
        this.home.push({ ...{ id: res.id }, ...res.data() });

        console.log(this.home)

      })
    })

    firebase.firestore().collection('participants').where("whr", "==", 'away').orderBy('randomnum', 'asc').get().then(val => {
      val.forEach(res => {
        console.log({ ...{ id: res.id }, ...res.data() })
        this.away.push({ ...{ id: res.id }, ...res.data() });
        console.log(this.away)
      })
    })


  }
  edit(state) {
    this.editProfile = this.adminProfile
    switch (state) {
      case 'open':
        console.log('profile open', this.profileDiv[0]);
        this.profile('close')
        this.editMode = true;
        this.renderer.setStyle(this.editDiv[0], 'display', 'block')
        break;
      case 'close':
        this.editMode = false;
        setTimeout(() => {
          this.renderer.setStyle(this.editDiv[0], 'display', 'none')
        }, 500);
        break;
    }
  }
  doneEdit() {
      this.creatingProfile= true
      this.db.collection('CMS_Profile').doc(firebase.auth().currentUser.uid).set(this.editProfile).then(res => {
        this.creatingProfile= false
        this.edit('close')
        this.creatingProfile= false
        this.editProfile = {
          formInfo: {
            fullName: null,
            number: null
          },
          image: null
        }
      }).catch(async err => {
        let alerter = await this.alertCtrl.create({
          header: 'ERROR',
          message: err.message,
          buttons: [{text: 'Okay',role:'cancel'}]
        })
        this.creatingProfile= false
        this.uploadProgress = 0
      })
  }
  async selectimage(image) {

    console.log(image.name)
    let imagetosend = image.item(0);
    console.log(imagetosend);

    if (!imagetosend) {
      const imgalert = await this.alertCtrl.create({
        message: 'Select image to upload',
        buttons: [{
          text: 'Okay',
          role: 'cancel'
        }]
      });
      imgalert.present();
    } else {
      if (imagetosend.type.split('/')[0] !== 'image') {
        const imgalert = await this.alertCtrl.create({
          message: 'Unsupported file type.',
          buttons: [{
            text: 'Okay',
            role: 'cancel'
          }]
        });
        imgalert.present();
        imagetosend = '';
        return;
      } else {
        const upload = this.storage.child(image.item(0).name).put(imagetosend);
        upload.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = progress
          console.log(progress);

          if (progress > 0) {
            // this.imageState = 'uploading'
          }
        }, error => {
        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            this.editProfile.image = downUrl;
            this.uploadProgress = 0;
          });
        });
      }
    }
  }
  signout() {
    firebase.auth().signOut().then(res => {
      this.navCtrl.navigateRoot('login')
    }).catch(err => {

    })
  }
  profile(state) {
    switch (state) {
      case 'open':
        console.log('profile open', this.profileDiv[0]);

        this.openProfile = true;
        this.renderer.setStyle(this.profileDiv[0], 'display', 'block')
        break;
      case 'close':
        this.openProfile = false;
        setTimeout(() => {
          this.renderer.setStyle(this.profileDiv[0], 'display', 'none')
        }, 500);
        break;
    }
  }
  changeView(state) {
    switch (state) {
      case 'main':

        this.screen = {
          main: true,
          tournaments: false,
          members: false
        }

        break;
      case 'tournaments':
        this.screen = {
          main: false,
          tournaments: true,
          members: false
        }
        break;
      case 'members':
        this.screen = {
          main: false,
          tournaments: false,
          members: true
        }
        break;
      default:
        break;
    }
  }
  log(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });

  }
  setfix(x) {
    console.log(x)
    this.router.navigate(['fixtures']);
  }
  currtourn() {
    this.router.navigate(['currtourn']);
  }

  async getCMSUserProfile() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged(user => {
        this.db.collection('CMS_Profile').doc(user.uid).onSnapshot(res => {
          
          this.adminProfile.image = res.data().image;
          this.adminProfile.formInfo.fullName = res.data().formInfo.fullName
          this.adminProfile.formInfo.number = res.data().formInfo.number
console.log(this.adminProfile);
        })
      })
    }, 1000);

  }
}
interface PROFILE {
  formInfo: {
    fullName: string,
    number: string
  }
  image: string

}