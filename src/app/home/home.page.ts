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

  // form for creating new tournament

//  state of the above form


//  show screen for acceptiong or declining applications


//  capture applications to accept or decline
openProfile = false;
 profileDiv = document.getElementsByClassName('profile-more')
  // BEGIN BACKEND HERE______________________________


  // reference to firestore
  db = firebase.firestore()

  // reference to storage
  storage = firebase.storage().ref()

// form for new tournament
  newTournForm:FormGroup;

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
  constructor(public alertController: AlertController,public loadingController: LoadingController, public serve: AllserveService, private authService: AuthService, private router: Router, public navCtrl: NavController, public renderer: Renderer2, public formBuilder: FormBuilder, public alertCtrl: AlertController) { 



  }

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
  signout() {
    firebase.auth().signOut().then(res => {
      this.navCtrl.navigateRoot('login')
    }).catch(err => {

    })
  }
  profile(state) {
    switch (state) {
      case 'open':
        console.log('profile open',this.profileDiv[0]);
        
        this.openProfile = true;
        this.renderer.setStyle(this.profileDiv[0],'display', 'block')
        break;
        case 'close':
          this.openProfile = false;
          setTimeout(() => {
            this.renderer.setStyle(this.profileDiv[0],'display', 'none')
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

 async getCMSUserProfile(){
    this.db.collection('CMS_users').where('profile','==','no').get().then( (res) =>{
      res.forEach( async doc =>{
        if(doc.exists){
          console.log('aaaa',doc.data());
          const alert = await this.alertController.create({
            header: 'Please Confirm!',
            backdropDismiss: false,
            message: 'Are you sure you want to Approve to be part of Nathis Tournament',
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
          
                }
              }
            ]
          });
          await alert.present();
        }
      })
 
      
    })
  }
}
