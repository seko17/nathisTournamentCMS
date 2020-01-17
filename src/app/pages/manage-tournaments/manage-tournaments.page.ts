
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { SetfixturesPage } from '../setfixtures/setfixtures.page';
import { FixturesPage } from '../fixtures/fixtures.page';
import { SetfixturePage } from 'src/app/setfixture/setfixture.page';
import { AllserveService } from 'src/app/services/allserve.service';
import { Subscription, Observable, observable, timer } from 'rxjs';
import { Motus } from 'motus';
import { DragdropPage } from '../dragdrop/dragdrop.page';

@Component({
  selector: 'app-manage-tournaments',
  templateUrl: './manage-tournaments.page.html',
  styleUrls: ['./manage-tournaments.page.scss'],
})
export class ManageTournamentsPage implements OnInit {

  input = { data: [] };
  ainput = { data: [] };

  modal
  async presentModal() {

    this.fixture = [];
    this.fixtures = [];
    console.log("drop = ", this.fixture)


    this.setUpTimeLine('close', null);
    this.modal = await this.modalController.create({
      component: DragdropPage,
      backdropDismiss: false,
      showBackdrop: true
    });



    this.modal.onDidDismiss().then(res => {

      this.fixture = [];
      this.fixtures = [];

      this.fixtureSetUp('open');


      this.fixture = this.serve.dropfixture;
      this.presentLoading();
    });
    this.promptFixtureConfig('close', null);
    return await this.modal.present();

  }
  userLocation = null;
  searchQuery: string = '';
  searchResults = [];
  myLocation = 'Johannesburg';
  gauteng = [
    // City of Johannesburg Metropolitan Municipality
    'Alexandra',
    'Johannesburg',
    'Lenasia',
    'Midrand',
    'Roodepoort',
    'Sandton',
    'Soweto',
    'Mshongo',
    'Klipfontienview',
    'Orange Farm',
    // Ekurhuleni Metropolitan Municipality
    'Alberton',
    'Germiston',
    'Benoni',
    'Boksburg',
    'Brakpan',
    'Clayville',
    'Daveyton',
    'Devon',
    'Duduza',
    'Edenvale',
    'Ennerdale',
    'Germiston',
    'Impumelelo',
    'Isando',
    'Katlehong',
    'Kempton Park',
    'KwaThema',
    'Nigel',
    'Olifantsfontein',
    'Reiger Park',
    'Springs',
    'Tembisa',
    'Thokoza',
    'Tsakane',
    'Vosloorus',
    'Wattville',
    //City of Tshwane Metropolitan Municipality
    'Atteridgeville',
    'Bronberg',
    'Bronkhorstspruit',
    'Centurion',
    'Cullinan',
    'Ekangala',
    'Ga-Rankuwa',
    'Hammanskraal',
    'Irene',
    'Mabopane',
    'Mamelodi',
    'Pretoria',
    'Rayton',
    'Refilwe',
    'Soshanguve',
    'Zithobeni',
    // Emfuleni Local Municipality
    'Boipatong',
    'Bophelong',
    'Evaton',
    'Sebokeng',
    'Sharpeville',
    'Vanderbijlpark',
    'Vereeniging',
    // Midvaal Local Municipality
    'Meyerton',
    // Lesedi Local Municipality
    'Heidelberg',
    'Ratanda',
    //Merafong City Local Municipality
    'Carletonville',
    'Khutsong',
    'Fochville',
    'Kokosi',
    'Greenspark',
    'Wedela',
    'Welverdiend',
    'Blybank',
    // Mogale City Local Municipality
    'Chamdor',
    'Dan Pienaarville',
    'Delporton',
    'Factoria',
    'Hekpoort',
    'Kagiso',
    'Kenmare',
    'Kromdraai',
    'Krugersdorp',
    'Munsieville South',
    'Magaliesburg',
    'Monument',
    'Muldersdrift',
    'Munsieville',
    'Noordheuwel',
    'Rangeview',
    'Silverfields',
    'Tarlton',
    // Randfontein Local Municipality
    'Aureus',
    'Bhongweni',
    'Botha AH',
    'Brandvlei',
    'Culemborg Park',
    'Dwarskloof AH',
    'Eikepark',
    'Eland SH',
    'Finsbury',
    'Green Hills',
    'Groot-Elandsvlei AH',
    'Hectorton',
    'Helikon Park',
    'Hillside AH',
    'Home Lake',
    'Kocksoord',
    'Loumarina AH',
    'Middelvlei AH',
    'Millside',
    'Mohlakeng',
    'Mohlakeng Ext 1',
    'Mohlakeng Ext 3',
    'Mohlakeng Ext 4',
    'Mohlakeng Ext 7',
    'Panvlak Gold Mine',
    'Pelzvale AH',
    'Randfontein',
    'Randfontein Estate Gold Mine',
    'Randfontein Harmony Gold Mine',
    'Randfontein NU',
    'Randfontein South AH',
    'Randgate',
    'Randpoort',
    'Rikasrus AH',
    'Robin Park',
    'Tenacre AH',
    'Toekomsrus',
    'West Porges',
    'Westergloor',
    'Wheatlands AH',
    'Wilbotsdal AH',
    'Zenzele',
    'Utiliy Economics',
    // Westonaria Local Municipality
    'Bekkersdal',
    'Westonaria'
  ];
  // CSS PROPERTIES ___________________________________
  newTournFormCont = document.getElementsByClassName('newTournamentForm');
  setUpApplicationsScreen = document.getElementsByClassName('setUpApplications');
  //  state for this screen
  setUpApplications = false;
  sponsorImage = ''
  sponsorName: string
  creatingTournament = false;
  validationMessages = {
    valid: [
      { type: 'required', message: 'Field required.' },
      { type: 'minlength', message: 'Field must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Field cannot be more than 25 characters long.' },
    ]
  }
  chooseConfigOption = false;
  configOptionDiv = document.getElementsByClassName('chooseFixtureConfig');

  timeLineSetup = false;
  setUpTimelineDiv = document.getElementsByClassName('setUpTimeline');

  setUpFixtures = false;
  setUpFixturesDiv = document.getElementsByClassName('setupFixtures');

  vedorApplications = false;

  // BEGIN  BACKEND HERE ______________________________
  db = firebase.firestore()
  storage = firebase.storage().ref()
  // form for new tournament
  newTournForm: FormGroup;
  tournamentObj = {
    formInfo: null,
    approved: false,
    approvedVendors: [],
    dateCreated: null,
    sponsors: [],
    state: 'newTournament',
    AcceptedApplications: 0,
    ApprovedApplications: 0,
    totalApplications: 0,
    DeclinedApplications: 0,
    DeclinedVendorApplications: 0,
    notifyUser: 'yes'
  };
  tempCardGen = []
  acceptedVendor = []
  // array for the green cards
  approvedTournaments = []
  // tslint:disable-next-line:member-ordering
  X
  TournSelectedObj = {
    doc: {
      state: '',
      AcceptedApplications: 0,
      ApprovedApplications: 0,
      DeclinedVendorApplications: 0,
      DeclinedApplications: 0,
      totalApplications: 0,
      formInfo: {
        tournamentName: '',
        location: '',
        startDate: '',
        endDate: '',
        applicationClosing: '',
        joiningFee: '',
        type: '',
      }
    }
  }
  // array for the red cards
  unapprovedTournaments = []
  tournamentApplications = []
  hparticipants = [];
  aparticipants = [];
  cparticipants = [];
  participants = [];

  accepted = []; // TEAM APPLICATIONS, stores all documents
  acceptedSearchResults = [] // filter and search
  
  vendorsapplicationArray = [] // VENDOR TO PAY APPLICATIONS
  declined = [];
  parti = [];
  progressOfImage = 0
  tourney = {
    doc: {
      state: '',
      AcceptedApplications: 0,
      ApprovedApplications: 0,
      DeclinedVendorApplications: 0,
      DeclinedApplications: 0,
      totalApplications: 0,
      formInfo: {
        tournamentName: '',
        location: '',
        startDate: '',
        endDate: '',
        applicationClosing: '',
        joiningFee: '',
        type: '',
      },
      hasApplications: null,
      approved: null,
      approvedVendors: [],
      dateCreated: null,
      notifyUser: null,
      sponsors: []
    },
    docid: null
  } 
  currentmatch = [];
  timer;
  docid;
  mins: number = 0;
  sub: Subscription;
  btntxt1 = 'First Half';
  btntxt2 = 'Second Half';
  btn1 = false;
  btn2 = true;
  constructor(public alertController: AlertController, public serve: AllserveService, public loadingController: LoadingController, public toastController: ToastController, public modalController: ModalController, public dragulaService: DragulaService, public renderer: Renderer2, public alertCtrl: AlertController, public formBuilder: FormBuilder) {

    let num = 0;



  }

  type: number;
  torntype;
  ngOnInit() {

    this.newTournForm = this.formBuilder.group({
      tournamentName: ['', [Validators.required, Validators.minLength((4))]],
      type: ['', Validators.required],
      location: [this.userLocation, []],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      joiningFee: ['', [Validators.required, Validators.minLength(3)]],
      applicationClosing: ['', Validators.required]
    })
    this.db.collection('newTournaments').onSnapshot(res => {
      this.getApprovedTournaments()
      this.getUnapprovedTournaments()
    })
    while (this.tempCardGen.length < 20) {
      let int = 0
      let counter = int + 1;
      this.tempCardGen.push({ hasApplications: true })
    }
    // Motus
  }


  tourndetails = [];
  disablefixtures = true;
  disablepaid = false;
  lengthparticipents: number = 0;
  tourntype = {};
  async finnishSetup(tournament, state) {
    // please keep this switch statement at the top
    switch (state) {
      case 'open':
        this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
        this.setUpApplications = true;
        break;
      case 'close':
        this.setUpApplications = false;
        setTimeout(() => {
          this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'none');
        }, 500);
        break;
      default:
        break;
    }
    if (tournament != null) {
      this.serve.tournid = tournament.docid;
    }
    console.log("Rose", tournament.docid)


    console.log(state, tournament)


    if (tournament.docid == null) {

    }
    else {
      let team = {
        docid: null,
        doc: null
      }
      let vendorObj = {
        docid: null,
        doc: null
      }
      firebase.firestore().collection('newTournaments').doc(tournament.docid).collection('vendorApplications').where('status', '==', 'awaiting').onSnapshot(res => {
        this.vendorsapplicationArray = []
        res.forEach(doc => {

          // this.vendorsapplicationArray.push(doc.data())
          vendorObj = {
            docid: doc.id,
            doc: doc.data()
          }
          this.vendorsapplicationArray.push(vendorObj)

        })
        console.log('vendor application', this.vendorsapplicationArray)
      })



      console.log('finish setup')


      let nums = 0;
      firebase.firestore().collection('participants').where('whr', '==', 'away').where('tournid', '==', tournament.docid).onSnapshot(val => {
        val.forEach(async res => {
          this.type = res.data().type;
          nums = nums + 1;
          this.lengthparticipents = nums;


          this.type = parseFloat(this.type.toString());
          console.log(nums, this.type)
          console.log('loadededed')


          // if (nums == this.type) {

          //   this.disablefixtures = false;
          //   this.disablepaid = true;

          //   const alert = await this.alertController.create({
          //     header: 'Good news:-)',
          //     message: 'The fixtures are ready to be set.',
          //     buttons: ['OK']
          //   });

          //   await alert.present();

          // }



          this.aparticipants.push({ ...{ id: res.id }, ...res.data() })
          console.log('current Participants = ', this.aparticipants)
        })
      })


      firebase.firestore().collection('participants').where('tournid', '==', tournament.docid).onSnapshot(async val => {
        this.cparticipants = []
        this.acceptednum = 0
        if (val.size == parseFloat(this.tourney.doc.formInfo.type)) {
          this.disablepaid = true;


          const alert = await this.alertController.create({
            header: 'Good news:-)',
            message: 'The fixtures are ready to be set.',
            buttons: ['OK']
          });

          await alert.present();
        }
        else {
          this.disablepaid = false;
        }

        val.forEach(res => {

          this.cparticipants.push({ ...{ id: res.id }, ...res.data() })
          console.log('current Participants = ', this.cparticipants)

          this.acceptednum = this.cparticipants.length;
          console.log('current Participants = ', this.acceptednum)
        })
      })















      this.generatefixtures(tournament);
      let num = 0;
      this.tourney = tournament;
      console.log(this.tourney.doc.formInfo.type)





      this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
      this.setUpApplications = true;
      this.tourndetails = [];
      this.tourndetails.push(tournament)

      let form = {};


      this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
      this.setUpApplications = true;
      this.db.collection('newTournaments').doc(tournament.docid).collection('teamApplications').where('status', '==', 'awaiting').onSnapshot(res => {
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
        console.log(tournament.docid);

        this.db.collection('newTournaments').doc(tournament.docid).onSnapshot(val => {
          console.log(val.data().formInfo)
          this.torntype = val.data().formInfo.type;
          console.log("Type = ", this.torntype)

          form = val.data().formInfo;

          firebase.firestore().collection('participants').where('tournid', '==', val.data().formInfo.tournamentName).onSnapshot(res => {
            res.forEach(val => {

              this.participants.push(val.data())
              console.log('participants = ', val.data())

              num = num + 1;

              let obb = {};
              obb = val.data();

              if (num % 2 == 0) {
                firebase.firestore().collection('participants').doc(val.id).update({ ...val.data(), ...{ whr: 'home' } })
                // this.participants.push({...val.data(),...{whr:"home"}})
              }
              else {
                // this.aparticipants.push({...val.data(),...{awhr:"away"}})
                firebase.firestore().collection('participants').doc(val.id).update({ ...val.data(), ...{ whr: 'away' } })
              }


              // if(this.participants.length==this.aparticipants.length)
              // {
              //   this.serve.randomfixture( this.participants,this.aparticipants);  
              // }


              console.log('number = ', num)
              console.log('parts  = ', this.participants)
            })
          })
        })
        this.db.collection('newTournaments').doc(tournament.docid).collection('teamApplications').where('status', '==', 'accepted').onSnapshot(val => {
          this.accepted = [];
          this.acceptedSearchResults = []

          val.forEach(res => {
            this.acceptedSearchResults.push({ ...form, ...{ tournid: tournament.docid }, ...{ id: res.id }, ...res.data() });




          })
          console.log('line 586',this.acceptedSearchResults);
          
          this.accepted = this.acceptedSearchResults
        })
        this.db.collection('newTournaments').doc(tournament.docid).collection('vendorApplications').where('status', '==', 'accepted').onSnapshot(val => {
          this.acceptedVendor = []
          val.forEach(res => {


            this.acceptedVendor.push(res.data());
            console.log('accepted vendros', this.acceptedVendor);
          });
        });
      });


    }
  }
  
  toggleTournamentForm(state) {
    switch (state) {
      case 'open':
        this.renderer.setStyle(this.newTournFormCont[0], 'display', 'block')
        this.creatingTournament = true;
        console.log('form open');

        break;
      case 'close':
        this.creatingTournament = false;
        setTimeout(() => {
          this.renderer.setStyle(this.newTournFormCont[0], 'display', 'none')
        }, 500);
        console.log('form close');
        break;
      default:
        break;
    }
  }
  //check tournaments vendors application
  // checkVendorApp(){
  //   this.db.collection('newTournaments').
  // }
  // selects sponsor Image

  getItems(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    console.log(ev);
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    
    if (val && val.trim() != '') {
      this.acceptedSearchResults = this.accepted.filter(item => {
        return item.refNumber.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
      console.log('Results = ', this.searchResults);
    } else if (val != ' ') {
      this.acceptedSearchResults = this.accepted.filter(item => {
        return item.refNumber.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else if (!val) {
      this.accepted = this.acceptedSearchResults
    }
    console.log('line 649',this.acceptedSearchResults);
    
  }
  selectLocation(location) {
    this.userLocation = location;
    this.searchResults = [];
    console.log(this.userLocation);
  }
  saveSponsor() {
    console.log('sponsor name', this.sponsorName);
    let obj = {
      sponsorName: this.sponsorName,
      sponsorImage: this.sponsorImage
    }
    this.tournamentObj.sponsors.push(obj)
    this.sponsorName = ''
    this.sponsorImage = ''
    this.progressOfImage = 0
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
          this.progressOfImage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);

        }, error => {
        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            this.sponsorImage = downUrl

            let newSponsor = {
              image: downUrl,

              name: image.item(0).name
            }
            // console.log(downUrl)
            // this.tournamentObj.sponsors.push(newSponsor)
            // console.log(this.tournamentObj.sponsors);

          });
        });
      }
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }
  async newTournament(formData) {
    let today = new Date();
    let date = new Date(today.toDateString());
    let startDat = new Date(formData.startDate);
    let endDate = new Date(formData.endDate);
    let applicDate = new Date(formData.applicationClosing)
    console.log('today', date);
    console.log('past date', startDat)

    if (date > startDat) {

      const alert = await this.alertController.create({
        header: 'Warning!',
        subHeader: 'Invalid Tournament start Date',
        message: 'Please select date from today onwards',
        buttons: ['OK']
      });

      await alert.present();

    }
    else if (endDate < startDat) {
      console.log('tournament end invalid');
      const alert = await this.alertController.create({
        header: 'Warning!',
        subHeader: 'Invalid Tournament end Date',
        message: 'Please select date from today onwards',
        buttons: ['OK']
      });

      await alert.present();

    }
    else if (applicDate < startDat) {
      console.log('application date invalid');
      const alert = await this.alertController.create({
        header: 'Warning!',
        subHeader: 'Invalid Application application Date',
        message: 'Please select date from today onwards',
        buttons: ['OK']
      });

      await alert.present();
    }
    else {
      console.log('se', formData.startDate)
      let loader = await this.loadingController.create({
        message: 'Creating Tournament'
      })
      loader.present()
      let date = new Date();

      this.tournamentObj = {
        formInfo: formData,
        approved: false,
        notifyUser: 'yes',
        approvedVendors: this.tournamentObj.approvedVendors,
        dateCreated: date.toDateString(),
        sponsors: this.tournamentObj.sponsors,
        state: 'newTournament',
        AcceptedApplications: 0,
        ApprovedApplications: 0,
        totalApplications: 0,
        DeclinedApplications: 0,
        DeclinedVendorApplications: 0
      }
      this.db.collection('newTournaments').add(this.tournamentObj).then(async res => {
        loader.dismiss()
        let alerter = await this.alertCtrl.create({
          header: 'Success',
          subHeader: 'Tournament Created',
          message: 'Please wait for it\'s approval from the Admin. It will be submitted immediately after the approval.',
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
      }).catch(async err => {
        let alerter = await this.alertCtrl.create({
          header: 'Oops!',
          subHeader: 'Something went wrong.',
          message: 'It might be the server but please check if your network is connected.',
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



  }
  getApprovedTournaments() {
    let tourn = {
      docid: null,
      doc: null,
      hasApplications: false
    }
    this.serve.tournaments = [];
    this.approvedTournaments = []
    this.db.collection('newTournaments').where('approved', '==', true).get().then(res => {

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
      this.serve.tournaments = this.approvedTournaments;
    })
  }
  getUnapprovedTournaments() {
    this.db.collection('newTournaments').where('approved', '==', false).onSnapshot(res => {
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
  vendorApplications(state) {
    switch (state) {
      case 'open':
        this.vedorApplications = true;
        break;
      case 'close':
        this.vedorApplications = false;
        break;
    }
  }
  setUpTimeLine(state, x) {
    // timeLineSetup prop
    // setUpTimelineDiv div
    switch (state) {
      case 'open':
        this.presentModal();
        console.log('participants = ')
        console.log('participants = ', this.hparticipants)
        // this.promptFixtureConfig('close',this.hparticipants)
        // this.timeLineSetup = true;
        // this.renderer.setStyle(this.setUpTimelineDiv[0], 'display', 'block');
        setTimeout(() => {
          this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'none');
        }, 500);
        this.setUpApplications = false;
        break;
      case 'close':
        console.log('participants = ', this.hparticipants)
        console.log('will close');

        this.timeLineSetup = false;
        // this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
        // this.setUpApplications = true;
        setTimeout(() => {
          this.renderer.setStyle(this.setUpTimelineDiv[0], 'display', 'none')
        }, 500);
        break;
      default:
        break;
    }
  }
  approvednum: number = 0;
  acceptednum: number = 0;
  applicationsnum: number = 0;
  generate() {
    this.fixtureSetUp('open');
    // firebase.firestore().collection('participants').where("tournid", "==", ).onSnapshot(val => {
    //   val.forEach(res => {

    //     this.hparticipants.push({ ...{ id: res.id }, ...res.data() })
    //     console.log("current Participants = ", this.hparticipants)
    //   })
    // })
  }
  promptFixtureConfig(state, x) {
    console.log(state)
    // this.presentModal();
    switch (state) {
      case 'open':
        this.chooseConfigOption = true;
        this.renderer.setStyle(this.configOptionDiv[0], 'display', 'flex');
        console.log('will open');

        break;
      case 'close':
        this.chooseConfigOption = false;

        setTimeout(() => {
          // this.renderer.setStyle(this.setUpFixturesDiv[0],'display','flex');
          this.renderer.setStyle(this.configOptionDiv[0], 'display', 'none');
        }, 500);
        //  this.presentModal();
        console.log('will close');



        console.log('fixture here', this.fixture)
        break;

      default:
        break;
    }
  }

  fixtureSetUp(state) {
    // setUpFixtures
    // setUpFixturesDiv
    console.log('called ', state);

    switch (state) {
      case 'open':
        console.log('fixtureSetUp open');

        this.setUpTimeLine('close', this.hparticipants);
        this.setUpFixtures = true;
        this.renderer.setStyle(this.setUpFixturesDiv[0], 'display', 'flex')
        break;
      case 'close':
        this.setUpFixtures = false;

        setTimeout(() => {
          this.renderer.setStyle(this.setUpFixturesDiv[0], 'display', 'none')
        }, 500);
        break;

      default:
        break;
    }
  }

  accept(x) {
    console.log(x)
    let obj = x;
    this.db.collection('newTournaments').doc(this.tourney.docid).collection('teamApplications').doc(x.docid).update({
      status: 'accepted'
    }).then(doc => {
      this.db.collection('newTournaments').doc(this.tourney.docid).update({
        AcceptedApplications: firebase.firestore.FieldValue.increment(1)
      })
    })

  }

  decline(x) {
    console.log('Decline', x)
    let obj = {};
    obj = x;
    // tslint:disable-next-line:max-line-length
    this.db.collection('newTournaments').doc(this.tourney.docid).collection('teamApplications').doc(x.docid).update({ status: 'declined' }).then(doc => {
      this.db.collection('newTournaments').doc(this.tourney.docid).update({
        DeclinedApplications: firebase.firestore.FieldValue.increment(1)
      })
    })
  }




  paid(c, pos) {
    // console.log(Math.ceil(Math.random() * 10))
    console.log(pos)
    if (this.disablepaid == true) {

    }
    else {
      if (pos % 2 == 0) {
        // tslint:disable-next-line:max-line-length
        this.db.collection('newTournaments').doc(c.tournid).collection('teamApplications').doc(c.id).update({ status: 'paid' }).then(res => {
          // this.db.collection('newTournaments').doc(c.tournid).collection('teamApplications').doc(c.id).delete().then(ress => {
          this.db.collection('participants').add({ ...c, ...{ whr: 'home' } });

          this.db.collection('newTournaments').doc(c.tournid).update({
            ApprovedApplications: firebase.firestore.FieldValue.increment(1)
          })
          // })
        })
      }
      else {
        // tslint:disable-next-line:max-line-length
        this.db.collection('newTournaments').doc(c.tournid).collection('teamApplications').doc(c.id).update({ status: 'paid' }).then(res => {
          // this.db.collection('newTournaments').doc(c.tournid).collection('teamApplications').doc(c.id).delete().then(ress => {
          this.db.collection('participants').add({ ...c, ...{ whr: 'away' } });
          this.db.collection('newTournaments').doc(c.tournid).update({
            ApprovedApplications: firebase.firestore.FieldValue.increment(1)
          })
        })

        // })
      }
    }
  }
  // tslint:disable-next-line:member-ordering
  q1 = [];
  // tslint:disable-next-line:member-ordering
  q2 = [];
  // tslint:disable-next-line:member-ordering
  fixture = [];

  async savefixture() {
    let q1 = this.fixture;

    console.log(this.fixture)


    console.log(q1)
    for (let r = 0; r < q1.length; r++) {
      let z: any = {};
      z = { matchdate: q1[r].matchdate, secs: 0, mins: 0, type: this.torntype, ascore: 0, score: 0, ...q1[r], random1: Math.floor((Math.random() * r) * 2) };
      console.log('Tdate =', z);
      if (z.matchdate == undefined || z.matchdate == 'Invalid Date') {
        const toast = await this.toastController.create({
          message: 'Enter the time and date for all the matches.',
          duration: 2000
        });
        toast.present();

        return 0;
      }
      else {

        console.log(this.fixture)

        this.fixtures = q1;
        this.fixture = [];
        this.db.collection('newTournaments').doc()
        const toast = await this.toastController.create({
          message: 'Fixture saved successfully.',
          duration: 2000
        });
        toast.present();
        toast.onDidDismiss().then(val => {

        })
      }
    }

  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Setting Fixtures',
      duration: 4000
    });
    await loading.present();
    await loading.onDidDismiss().then(val => {
      // this.fixture = this.serve.fixture;
      // console.log("Serve Array = ", this.fixture)

      console.log('Loader dismiss fixture array!');
    })

  }
  ionViewWillEnter() {

    this.presentLoading();
  }
  showSideEvent(v) {
    this.TournSelectedObj = v
    console.log('click', this.TournSelectedObj);
  }
  async createfixture() {
    let q1 = this.fixtures;




    this.deldocs();
    console.log(this.participantdocids)
    firebase.firestore().collection('newTournaments').doc(this.tourney.docid).update({ state: 'inprogress' });

    let val: any = parseFloat(this.tourney.doc.formInfo.type) / 2;
    val = val.toString();

    console.log("VAL = ", val);

    firebase.firestore().collection('newTournaments').doc(this.tourney.docid).update({ formInfo: { applicationClosing: this.tourney.doc.formInfo.applicationClosing, tournamentName: this.tourney.doc.formInfo.tournamentName, location: this.tourney.doc.formInfo.location, joiningFee: this.tourney.doc.formInfo.joiningFee, endDate: this.tourney.doc.formInfo.endDate, startDate: this.tourney.doc.formInfo.startDate, type: val } });


    for (let r = 0; r < q1.length; r++) {
      let z: any = {};
      z = { matchdate: new Date(q1[r].matchdate).toLocaleString(), type: val, secs: 0, mins: 0, ascore: 0, score: 0, ...q1[r] };
      console.log('Tdate =', z);
      if (z.matchdate == undefined || z.matchdate == 'Invalid Date') {
        const toast = await this.toastController.create({
          message: 'Enter the time and date for all the matches.',
          duration: 2000
        });
        toast.present();
      }
      else {
        firebase.firestore().collection('MatchFixtures').add({ ...z, ...{ type: val } }).then(val => {

        })
        console.log(this.fixtures)
        const toast = await this.toastController.create({
          message: 'Fixture created successfully.',
          duration: 2000
        });
        toast.present();
        this.deldocs();
      }
    }
  }
  deldocs() {
    for (let x = 0; x < this.participantdocids.length; x++) {
      console.log('Delete HERE!')
      firebase.firestore().collection('participants').doc(this.participantdocids[x].id).delete();
    }
  }
  participantdocids = [];
  generatefixtures(tournament) {
    let temp = [];
    let temp2 = [];
    this.participantdocids = [];
    console.log('Tourney', tournament)
    let num = 0;
    firebase.firestore().collection('participants').where('tournid', '==', tournament.docid).onSnapshot(res => {
      this.fixture = []
      res.forEach(val => {

        this.participantdocids.push({ id: val.id });
        // console.log("participants = ",val.data())
        let data = val.data();

        num = num + 1;
        console.log(num)
        if (num % 2 == 0) {
          temp2.push({ ...val.data(), ...{ type: this.torntype, matchdate: null, goal: 0, whr: 'home', offsides: 0, corners: 0, mins: 0, secs: 0, yellow: 0, red: 0 } });


          this.serve.randomfixture(temp, temp2)
          this.fixture = this.serve.fixture;

          temp = []; temp2 = [];
        }

        else if (num % 2 == 1) {

          temp.push({ ...val.data(), ...{ type: this.torntype, score: 0, matchdate: null, goal: 0, whr: 'away', aoffsides: 0, acorners: 0, mins: 0, secs: 0, ayellow: 0, ared: 0, offsides: 0, corners: 0, yellow: 0, red: 0 } });
        }
        console.log(this.serve.fixture)
      })
    })
  }
  acceptVendorApplication(v) {
    console.log('aaaaa', v);
    this.db.collection('newTournaments').doc(this.tourney.docid).collection('vendorApplications').doc(v.docid).update({ status: 'accepted' }).then(doc => {
      this.db.collection('newTournaments').doc(this.tourney.docid).update({
        AcceptedVendorApplications: firebase.firestore.FieldValue.increment(1)
      })
    })

  }
  declineVendorApplication(v) {
    this.db.collection('newTournaments').doc(this.tourney.docid).collection('vendorApplications').doc(v.docid).update({ status: 'declined' }).then(doc => {
      this.db.collection('newTournaments').doc(this.tourney.docid).update({
        DeclinedVendorApplications: firebase.firestore.FieldValue.increment(1)
      })
    })
  }
  fixtures;
  editfixture() {
    console.log('This is where you edit fixtures');

    this.fixture = this.fixtures;
    this.fixtures = [];
  }

  tournid = null;

  refnum;
  search() {



  }




  test() {


    console.log(this.refnum)






  }
















  async moredetails(t) {




    let num = 0;
    let num2 = 0;
    let num3 = 0;
    this.hparticipants = [];
    this.aparticipants = [];


    {

      firebase.firestore().collection('newTournaments').doc(t.docid).collection('teamApplications').where('status', '==', 'awaiting').onSnapshot(rez => {
        rez.forEach(val => {

          num = num + 1;
          this.applicationsnum = val.data().length;
          console.log(this.applicationsnum = num)
        })
      })
      firebase.firestore().collection('newTournaments').doc(t.docid).collection('teamApplications').where('status', '==', 'accepted').get().then(rez => {
        rez.forEach(val => {
          firebase.firestore().collection('newTournaments').doc(t.docid).collection('teamApplications').where('status', '==', 'accepted').onSnapshot(rez => {
            rez.forEach(val => {

              num2 = num2 + 1;
              this.acceptednum = num2;

              console.log(num2)
            })
          })
          firebase.firestore().collection('participants').where('tournid', '==', t.docid).onSnapshot(rez => {
            rez.forEach(val => {

              num3 = num3 + 1;
              this.approvednum = num3;
              console.log(num3)
              if (num % 2 == 0) {

                this.hparticipants.push({ ...val.data(), ...{ whr: 'home' } })
              }
              else {
                this.aparticipants.push({ ...val.data(), ...{ whr: 'away' } })
              }
            })
          })
        })
      })
    }
  }
}

export interface TOURN {
  doc: {
    state: string
    formInfo: {
      tournamentName: string,
      location: string,
      startDate: string,
      endDate: string,
      applicationClosing: string
      joiningFee: string,
      type: string
    }
  }











}