import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AllserveService } from '../services/allserve.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
 newTournFormCont = document.getElementsByClassName('newTournamentForm');
//  state of the above form
 creatingTournament = false;

//  show screen for acceptiong or declining applications
 setUpApplicationsScreen = document.getElementsByClassName('setUpApplications');
//  state for this screen
 setUpApplications = false;
//  capture applications to accept or decline
 tournamentApplications = []
  // ______________________________
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
    // array for the green cards
    approvedTournaments = []

    // array for the red cards
    unapprovedTournaments = []

    // 
    tournaments = []
    tournamentsToDisplay = []
  constructor(public loadingController: LoadingController, public serve: AllserveService, private authService: AuthService, private router: Router, public navCtrl: NavController, public renderer: Renderer2, public formBuilder: FormBuilder, public alertCtrl: AlertController) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'please wait...',
      duration: 2000
    });
    await loading.present();

    await loading.onDidDismiss().then(role => {
      this.serve.randomfixture(this.home, this.away);
    });

    console.log('Loading dismissed!');
  }

  ngOnInit() {
    // add dummy teams
    this.newTournForm = this.formBuilder.group({
      tournamentName: ['', [Validators.required, Validators.minLength((4))]],
      type: ['',Validators.required],
      location: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      joiningFee: ['',[Validators.required, Validators.minLength(3)]],
      applicationClosing: ['',Validators.required]
    })
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
    this.db.collection('newTournaments').onSnapshot(res => {
      this.getApprovedTournaments()
      this.getUnapprovedTournaments()
    })
    
  }
  signout() {
    firebase.auth().signOut().then(res => {
      this.navCtrl.navigateRoot('login')
    }).catch(err => {

    })
  }
  changeView(state) {
    this.setUpApplications = false;
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
  toggleTournamentForm(state) {
    switch (state) {
      case 'open':
          this.renderer.setStyle(this.newTournFormCont[0], 'display', 'block')
          this.creatingTournament = true;
        break;
    case 'close' :
        this.creatingTournament = false;
        setTimeout(() => {
          this.renderer.setStyle(this.newTournFormCont[0], 'display', 'none')
        }, 500);
      break;
      default:
        break;
    }
  }
  async newTournament(formData) {
      let loader = await this.loadingController.create({
        message:'Creating Tournament'
      })
      loader.present()
    let date = new Date();

    this.tournamentObj = {
      formInfo: formData,
      approved: false,
      approvedVendors: this.tournamentObj.approvedVendors,
      dateCreated: date.toDateString(),
      sponsors: this.tournamentObj.sponsors,
      state: 'newTournament',
    }
    this.db.collection('newTournaments').add(this.tournamentObj).then( async res => {
      loader.dismiss()
      let alerter = await this.alertCtrl.create({
        header: 'Success',
        subHeader: 'Tournament Created',
        message:"Please wait for it's approval from the Admin. It will be submitted immediately after the approval.",
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.newTournForm.reset()
              this.toggleTournamentForm('close')
            }
          }
        ]
      })
      alerter.present()
    }).catch( async err => {
      let alerter = await this.alertCtrl.create({
        header: 'Oops!',
        subHeader: 'Something went wrong.',
        message:"It might be the server but please check if your network is connected.",
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.newTournForm.reset()
              this.toggleTournamentForm('close')
            }
          }
        ]
      })
      alerter.present()
    })
    
  }
  getApprovedTournaments() {
    let tourn = {
      docid: null,
      doc: null,
      hasApplications: false
    }
    this.db.collection('newTournaments').where('approved', '==', true).get().then(res => {
      this.approvedTournaments = []
      res.forEach(doc => {
        this.db.collection('newTournaments').doc(doc.id).collection('teamApplications').get().then(res => {
          if (res.empty) {
            tourn = {
              docid: doc.id,
              doc: doc.data(),
              hasApplications: false
            }
            this.approvedTournaments.push(tourn);
            tourn = {
              docid: null,
              doc: null,
              hasApplications: false
            }
          } else {
            tourn = {
              docid: doc.id,
              doc: doc.data(),
              hasApplications: true
            }
            this.approvedTournaments.push(tourn);
            tourn = {
              docid: null,
              doc: null,
              hasApplications: false
            }
          }
        
        })
      })
      console.log('approvedTournaments ', this.approvedTournaments);
      
    })
  }
  getUnapprovedTournaments() {
    this.db.collection('newTournaments').where('approved', '==', false).get().then(res => {
      this.unapprovedTournaments = []
      res.forEach(doc => {
        let tourn = {
          docid: doc.id,
          doc: doc.data()
        }
        this.unapprovedTournaments.push(tourn);
        tourn = {
          docid: null,
          doc: null
        }
      })
      console.log(this.unapprovedTournaments);
      
    })
  }
  finnishSetup(tournament) {
    let team = {
      docid: null,
      doc: null
    }
    this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
    this.setUpApplications = true;
    this.db.collection('newTournaments').doc(tournament.docid).collection('teamApplications').get().then(res => {
      this.tournamentApplications = []
      res.forEach(doc => {
        team = {
          docid: doc.id,
          doc: doc.data()
        }
        this.tournamentApplications.unshift(team)
        team = {
          docid: null,
          doc: null
        }
      })
      console.log(this.tournamentApplications);
       
    })

  }
  // selects sponsor Image
  async selectimage(image){
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
          console.log(progress);
          
        }, error => {
        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            let newSponsor = {
              image: downUrl,
              name: image.item(0).name
            }
            this.tournamentObj.sponsors.push(newSponsor)
            console.log(this.tournamentObj.sponsors);
            
          });
        });
       }
    }
  }
  log(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });
    this.router.navigate(['setfixtures']);
  }
  setfix(x) {
    console.log(x)
    this.router.navigate(['fixtures']);
  }
  currtourn() {
    this.router.navigate(['currtourn']);
  }
// send(){
//   let token = 'ejqZFghC6HTOlzkk0W4Wte:APA91bEPz_RsFyBm6QHuZVfE6Ge8724nFoC3SANubEa_OGHAsmcnk0Zc86tvvUvSLu5yVKYmdHZ3vbX8VpF9P1Ts9aIEUdC9nUvwDNhAQYtvnJcweojyyXydmr3YvdnWXyqQ1lE0-Jg9';
 
//     let message = {
//         data: {    //This is only optional, you can send any data
//             score: '850',
//             time: '2:45'
//         },
//         notification:{
//             title : 'Title of notification',
//             body : 'Body of notification'
//         },
//         token : token
//         };
 
// FCM.send(message, function(err, response) {
//     if(err){
//         console.log('error found', err);
//     }else {
//         console.log('response here', response);
//     }
// })
// }
}
