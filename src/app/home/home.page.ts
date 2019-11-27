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
  // CSS Classes __________________
screen = {
    main: true,
    tournaments: false,
    members: false
  }
 newTournFormCont = document.getElementsByClassName('newTournamentForm');
 creatingTournament = false;
  // ______________________________

  db = firebase.firestore()
  newTournForm:FormGroup
  team: any = {};
  // q1
  home = [];
  // q2
  away = [];

  tempCardGen = []

  validationMessages = {
    valid: [
        { type: 'required', message: 'Field required.' },
        { type: 'minlength', message: 'Field must be at least 4 characters long.' },
        { type: 'maxlength', message: 'Field cannot be more than 25 characters long.' },
      ]
    }

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


  }
  signout() {
    firebase.auth().signOut().then(res => {
      this.navCtrl.navigateRoot('login')
    }).catch(err => {

    })
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

    let tournamentObj = {
      formInfo: formData,
      approved: false,
      approvedVendors: [],
      dateCreated: date.toDateString(),
      sponsors: [],
      state: 'newTournament',

    }
    this.db.collection('newTournaments').add(tournamentObj).then( async res => {
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


}
