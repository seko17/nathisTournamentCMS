
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { SetfixturesPage } from '../setfixtures/setfixtures.page';
import { FixturesPage } from '../fixtures/fixtures.page';
import { SetfixturePage } from 'src/app/setfixture/setfixture.page';
import { AllserveService } from 'src/app/services/allserve.service';
import { Subscription, Observable, observable,timer } from 'rxjs';

@Component({
  selector: 'app-manage-tournaments',
  templateUrl: './manage-tournaments.page.html',
  styleUrls: ['./manage-tournaments.page.scss'],
})
export class ManageTournamentsPage implements OnInit {
  
  
 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  input={data:[]};
  ainput={data:[]};
  
  modal
  async presentModal() {
    this.modal = await this.modalController.create({
      component: SetfixturesPage,
      backdropDismiss:false,
      showBackdrop:true
    });
    this.modal.onWillDismiss().then(res=>{

      this.fixtureSetUp('open')
      this.presentLoading();
     })
    return await this.modal.present();

    

  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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

  }
  tempCardGen = []
  // array for the green cards
  approvedTournaments = []

  // array for the red cards
  unapprovedTournaments = []
  tournamentApplications = []
  hparticipants=[];
aparticipants =[];
cparticipants =[];
parti =[];


currentmatch =[];
timer;
docid;
mins:number =0;
sub :Subscription;
btntxt1 ="First Half";
btntxt2 ="Second Half";
btn1 =false;
btn2 =true;
  constructor(public alertController: AlertController,public serve: AllserveService, public loadingController: LoadingController, public toastController: ToastController,public modalController:ModalController,public dragulaService: DragulaService,public renderer: Renderer2, public alertCtrl: AlertController, public formBuilder: FormBuilder) {


    










   






let num =0;










    this.hparticipants=[];
this.aparticipants=[];
    firebase.firestore().collection('participants').where("whr","==","home").get().then(val=>{
      val.forEach(res=>{

        this.hparticipants.push({...{id:res.id},...res.data()})
        console.log("current Participants = "  ,this.hparticipants)
      })
    })



    firebase.firestore().collection('participants').where("whr","==","away").get().then(val=>{
      val.forEach(res=>{

        this.aparticipants.push({...{id:res.id},...res.data()})
        console.log("current Participants = "  ,this.aparticipants)
      })
    })


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
  finnishSetup(tournament, state) {
    let team = {
      docid: null,
      doc: null
    }


    this.generatefixtures(tournament);
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

            this.participants.push(val.data())
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


    
    switch (state) {
      case 'open':
        this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'flex');
        this.setUpApplications = true;
        break;
      case 'close':
        this.setUpApplications = false;
        console.log('will closeeeeee');

        setTimeout(() => {
          this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'none');
        }, 500);
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
          console.log(progress);

        }, error => {
        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            let newSponsor = {
              image: downUrl,
              
              name: image.item(0).name
            }
            console.log(downUrl)
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
    this.serve.tournaments =[];
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
this.serve.tournaments =this.approvedTournaments;
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




  setUpTimeLine(state,x) {
    // timeLineSetup prop
    // setUpTimelineDiv div

    
    switch (state) {
      case 'open':
          this.presentModal();
          console.log("participants = ")
          console.log("participants = ",this.hparticipants)
        // this.promptFixtureConfig('close',this.hparticipants)
        this.timeLineSetup = true;
        this.renderer.setStyle(this.setUpTimelineDiv[0], 'display', 'block');
        setTimeout(() => {
          this.renderer.setStyle(this.setUpApplicationsScreen[0], 'display', 'none');
        }, 500);
        this.setUpApplications = false;
        break;
      case 'close':
        console.log("participants = ",this.hparticipants)
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

  
  promptFixtureConfig(state,x) {
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
        this.fixtureSetUp('open');
        // setTimeout(() => {
        //   this.renderer.setStyle(this.setUpFixturesDiv[0],'display','flex');
          // this.renderer.setStyle(this.configOptionDiv[0], 'display', 'none');
        // }, 500);
        //  this.presentModal();

      
        // console.log('will close');
        this.fixture = this.serve.fixture;

        console.log("fixture here",this.fixture)
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
        
          this.setUpTimeLine('close',this.hparticipants);
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


  tourney;
  participants =[];
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
  ​ q1 = [];
  q2 = [];
  fixture = [];

  async savefixture() {
let q1 =this.fixture;
    
    console.log(this.fixture)
    for (let r = 0; r < q1.length; r++) {
      let z: any = {};
      z = {matchdate:new Date(q1[r].matchdate).toDateString(),secs:0, mins: 0, ascore: 0, score: 0, ...q1[r], random1: Math.floor((Math.random() * r) * 2), random2: Math.floor((Math.random() * r) + 3) };
      console.log("Tdate =", z);
      if (z.matchdate == undefined ||z.matchdate =="Invalid Date") {
        const toast = await this.toastController.create({
          message: 'Enter the time and date for all the matches.',
          duration: 2000
        });
        toast.present();
      }
      else {
        // firebase.firestore().collection('MatchFixtures').add(z).then(val => {
        //   console.log(val)
        // })
        console.log(this.fixture)

        this.fixtures =this.fixture;
        this.fixture=[];
        const toast = await this.toastController.create({
          message: 'Fixture saved successfully.',
          duration: 2000
        });
        toast.present();
     
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
      this.fixture = this.serve.fixture;
      console.log("Serve Array = ", this.fixture)
    })
    console.log('Loading dismissed!');
  }
  ionViewWillEnter() {
    this.presentLoading();
  }
 













  async createfixture() {
    let q1 =this.fixtures;
        
        console.log(this.fixtures)
        for (let r = 0; r < q1.length; r++) {
          let z: any = {};
          z = {matchdate:new Date(q1[r].matchdate).toDateString(),secs:0, mins: 0, ascore: 0, score: 0, ...q1[r], random1: Math.floor((Math.random() * r) * 2), random2: Math.floor((Math.random() * r) + 3) };
          console.log("Tdate =", z);
          if (z.matchdate == undefined ||z.matchdate =="Invalid Date") {
            const toast = await this.toastController.create({
              message: 'Enter the time and date for all the matches.',
              duration: 2000
            });
            toast.present();
          }
          else {
            firebase.firestore().collection('MatchFixtures').add(z).then(val => {
              console.log(val)
            })
            console.log(this.fixtures)
            const toast = await this.toastController.create({
              message: 'Fixture created successfully.',
              duration: 2000
            });
            toast.present();
         
          }
        }
      
      }
    
    
    


      generatefixtures(tournament)
      {
        let temp =[];
        let temp2 =[];
        console.log("Tourney",tournament)
        let num =0;
        firebase.firestore().collection('participants').get().then(res=>{
          res.forEach(val=>{
    
            
            // console.log("participants = ",val.data())
   
    
    let data =val.data();
    
            num =num+1;
        

            console.log(num)
            if(num%2==0)
            {
        
         
        
            temp2.push({...val.data(),...{matchdate:null,goal:0}});


            this.serve.randomfixture(temp,temp2)
            this.fixture=this.serve.fixture;

            temp=[];temp2=[];
          }
        
          else  if(num%2==1)
          {
            
            temp.push({...val.data(),...{matchdate:null,goal:0}});
          }
           console.log(this.serve.fixture)
           
    
          })})
      }




fixtures;
      editfixture()
      {
console.log("This is where you edit fixtures");
       
this.fixture =this.fixtures;
this.fixtures=[];
        



      }




    
}

