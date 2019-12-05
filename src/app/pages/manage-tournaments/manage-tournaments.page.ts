
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-manage-tournaments',
  templateUrl: './manage-tournaments.page.html',
  styleUrls: ['./manage-tournaments.page.scss'],
})
export class ManageTournamentsPage implements OnInit {
  // CSS PROPERTIES ___________________________________
  newTournFormCont = document.getElementsByClassName('newTournamentForm');
  setUpApplicationsScreen = document.getElementsByClassName('setUpApplications');
  //  state for this screen
  setUpApplications = false;
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

  }
  tempCardGen = []
  // array for the green cards
  approvedTournaments = []

  // array for the red cards
  unapprovedTournaments = []
  tournamentApplications = []
  cparticipants=[];
  constructor(public renderer: Renderer2, public alertCtrl: AlertController, public formBuilder: FormBuilder, public loadingController: LoadingController) {
this.cparticipants=[];
    firebase.firestore().collection('participants').get().then(val=>{
      val.forEach(res=>{

        this.cparticipants.push({...{id:res.id},...res.data()})
        console.log("current Participants = "  ,this.cparticipants)
      })
    })


   }

  ngOnInit() {
    this.newTournForm = this.formBuilder.group({
      tournamentName: ['', [Validators.required, Validators.minLength((4))]],
      type: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
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
  }
  finnishSetup(tournament) {
    let team = {
      docid: null,
      doc: null
    }
let num =0;
    console.log(tournament)
    this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
    this.setUpApplications = true;


    let form ={};
    this.tourney =tournament;
 
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
      console.log(tournament.docid);
​
      this.db.collection('newTournaments').doc(tournament.docid).get().then(val=>{
        console.log(val.data().formInfo)
        
        form =val.data().formInfo;
​
        firebase.firestore().collection('participants').where("tournamentName","==",val.data().formInfo.tournamentName).get().then(res=>{
          res.forEach(val=>{
            console.log("participants = ",val.data())
 num = num+1;
​
let obb = {};
obb =val.data();
​
            if(num%2 == 0)
            {
              firebase.firestore().collection('participants').doc(val.id).update({...val.data(),...{whr:"home"}})
              // this.participants.push({...val.data(),...{whr:"home"}})
            }
            else
            {
              // this.aparticipants.push({...val.data(),...{awhr:"away"}})
              firebase.firestore().collection('participants').doc(val.id).update({...val.data(),...{whr:"away"}})
            }
​
​
            // if(this.participants.length==this.aparticipants.length)
            // {
            //   this.serve.randomfixture( this.participants,this.aparticipants);  
            // }
            
​
            console.log("number = ",num)
            console.log("parts  = ",this.participants)
          })
        })
      })
​
​
​
​
      this.db.collection('newTournaments').doc(tournament.docid).collection('teamApplications').where("status","==","accepted").get().then(val=>{
        val.forEach(res=>{
          
          this.accepted.push({...form,...{tournid:tournament.docid},...{id:res.id},...res.data()});
          console.log("data = ",this.accepted)
        })
      })
       
    })






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
  // selects sponsor Image
  async selectimage(image) {
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
  async newTournament(formData) {
    let loader = await this.loadingController.create({
      message: 'Creating Tournament'
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
    this.db.collection('newTournaments').add(this.tournamentObj).then(async res => {
      loader.dismiss()
      let alerter = await this.alertCtrl.create({
        header: 'Success',
        subHeader: 'Tournament Created',
        message: "Please wait for it's approval from the Admin. It will be submitted immediately after the approval.",
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
        message: "It might be the server but please check if your network is connected.",
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
  setUpTimeLine(state,x) {
    // timeLineSetup prop
    // setUpTimelineDiv div

    console.log("participants = ",this.cparticipants)
    switch (state) {
      case 'open':
        this.promptFixtureConfig('close')
        this.timeLineSetup = true;
        this.renderer.setStyle(this.setUpTimelineDiv[0], 'display', 'block');
        setTimeout(() => {
          this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'none');
        }, 500);
        this.setUpApplications = false;
        break;
      case 'close':
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
  promptFixtureConfig(state) {
    switch (state) {
      case 'open':
        this.chooseConfigOption = true;
        this.renderer.setStyle(this.configOptionDiv[0], 'display', 'flex');
        console.log('will open');

        break;
      case 'close':
        this.chooseConfigOption = false;
        setTimeout(() => {
          this.renderer.setStyle(this.configOptionDiv[0], 'display', 'none');
        }, 500);
        console.log('will close');

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
        
          this.setUpTimeLine('close',this.cparticipants);
        this.setUpFixtures = true;
      this.renderer.setStyle(this.setUpFixturesDiv[0],'display','flex')
        break;
      case 'close':
          this.setUpFixtures = false;
         setTimeout(() => {
          this.renderer.setStyle(this.setUpFixturesDiv[0],'display','none')
         }, 500);
        break;

      default:
        break;
    }
  }


  tourney;
  participants =[];
  aparticipants =[];
  accepted =[];
  declined =[];
  accept()
  {
  console.log("Accept")
  let obj ={};
  obj =this.tournamentApplications[0];
  ​
  ​
  console.log("_____________________________________");
  console.log(this.tourney.docid);
  console.log(this.tournamentApplications[0].docid);
  this.db.collection('newTournaments').doc(this.tourney.docid).collection('teamApplications').doc(this.tournamentApplications[0].docid).update({status:"accepted"});
  }
  ​
  ​
  decline()
  {
  console.log("Decline")
  ​
  let obj ={};
  obj =this.tournamentApplications[0];
  ​
  ​
  console.log("____________________________________");
  console.log(this.tourney.docid);
  console.log(this.tournamentApplications[0].docid);
  this.db.collection('newTournaments').doc(this.tourney.docid).collection('teamApplications').doc(this.tournamentApplications[0].docid).update({status:"declined"});
  }
  ​
  ​
  ​
  paid(c)
  {
  console.log(c)
  this.db.collection('newTournaments').doc(c.tournid).collection('teamApplications').doc(c.id).update({bank:"paid"}).then(res=>{
  ​
    this.db.collection('newTournaments').doc(c.tournid).collection('teamApplications').doc(c.id).delete().then(ress=>{
      this.db.collection('participants').add(c);
  ​
    })
  ​
    
  })
  ​
  ​
  }
  ​




}
