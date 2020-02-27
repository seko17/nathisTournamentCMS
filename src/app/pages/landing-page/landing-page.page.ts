
import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { AllserveService } from 'src/app/services/allserve.service';
import * as firebase from 'firebase';
import { Subscription, Observable, observable, timer } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Match2Service } from '../../services/match2.service';
import { ModalController } from '@ionic/angular';
import { Match2woPage } from '../match2wo/match2wo.page';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
  // CSS Properties_____________________________
  viewMatchDiv = document.getElementsByClassName('viewMatch');

  // divs that contain details about the team
  viewingTeam = {
    away: false,
    home: false
  }
  awayTeamDiv = document.getElementsByClassName('teamAway');
  homeTeamDiv = document.getElementsByClassName('teamHome');

  // divs that contain details about the player
  viewingPlayer = {
    away: false,
    home: false,
  }
  awayPlayerDiv = document.getElementsByClassName('playerAway');
  homePlayerDiv = document.getElementsByClassName('playerHome');

  // div carrying playing match action buttons
  matchActionState = {
    away: false,
    home: false,
  }
  awayPlayerActions = document.getElementsByClassName('awayButton');
  homePlayerActions = document.getElementsByClassName('homeButton');

  // opens the div carrying info about a match
  viewingMatch = false;

  // switches between lineup and summary
  matchView = 'lineup'
  playing
  filterBy = 'inprogress'
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BEGGIN BACKEND HERE

penalties = {
  home: {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    total: 0,
    reset: false
  },
  away: {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    total: 0,
    reset: false
  },
  homeTotal: 0,
  awayTotal: 0
}
showPenalties = false
penaltiesDiv = document.getElementsByClassName('penalties')
  tournament = [];
  toFilter = []
  adminProfile = {}
  approvedTournaments = [];
  db = firebase.firestore();
  input = { data: [] };
  ainput = { data: [] };
  tempCardGen = [] // temporary card generator, used for ngFor

  clicked = [];

  fixture = [];

  blocker = this.allserve.blocker;
  timer;
  docid;
  mins: number = 0;
  secs: number = 0;
  sub: Subscription;

 
  currentmatch = [];
  position = null;
  matchobject: any = {};
  viewedMatch = null
  currmatch = [];
  // keep in mind, the playerObj will pass null if were closing the panel
  playerobj = [];
  aplayerobj = [];

  team1 = [];
  team2 = [];

  fixtureid;

  childrenarray =[];


  score;
  ascore;
  tourname;
  id;
  matchstats = [];
  goals = [];
  agoals;
  pastMatchCat = null
  match = {
    type1: [],// 1
    type2: [],// 2
    type4: [], // 8
    type8: [], // 16
    type16: [], // 32
    winner: {}
  }
  activeTourn = {} as any
  selectedTorun = null
  timeLineIndx = null
  constructor(public toastController: ToastController,public modalController: ModalController, public game2: Match2Service, public loadingController: LoadingController, public allserve: AllserveService, public alertController: AlertController, public serve: AllserveService, public zone: NgZone, public renderer: Renderer2) {

    let tourn = {
      docid: null,
      doc: null,
      hasApplications: false
    }
    this.serve.tournaments = [];
    this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", "inprogress").where('parent','==','yes').get().then(res => {
      this.tournament = [];
      res.forEach(doc => {
        console.log(doc.data())
        this.tournament.push({ ...{ docid: doc.id }, ...doc.data() })

      })

      this.serve.firstdoc = this.tournament;
      console.log("Menu = ", tourn)
    })
  }

  ngOnInit() { }
btn1 
btntxt
btn2
btntxt2
btn3
btntxt3
btn4
btntxt4

disableall:boolean;
stats =[];

  async ionViewWillLeave() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Warning!',
      message: 'Leaving this page during a match will pause any ongoing matches!',
      buttons: ['OK']
    });

    await alert.present();

  }
penaltiesPanel(cmd) {
  switch (cmd) {
    case 'open':
      this.renderer.setStyle(this.penaltiesDiv[0],'display','flex');
      this.showPenalties = true
      break;
      case 'close':
        this.showPenalties = false
      setTimeout(() => {
        this.renderer.setStyle(this.penaltiesDiv[0],'display','none');
      }, 500);
        break;
  }
}
agv:number =0;
hgv:number =0
ag()
{
this.agv =this.agv+1;
console.log(this.agv)
}

hg()
{
  this.hgv =this.hgv+1;
  console.log(this.hgv)
}


  // operates the penalties indicators view
goal(side) {
  switch (side) {
    case 'home':
      if (this.penalties.home.one==null) {
        this.penalties.home.one = true
        this.penalties.home.total = this.penalties.home.total + 1

      } else if (this.penalties.home.two==null) {
        this.penalties.home.two = true
        this.penalties.home.total = this.penalties.home.total + 1

      } else if (this.penalties.home.three==null) {
        this.penalties.home.three = true
        this.penalties.home.total = this.penalties.home.total + 1

      } else if (this.penalties.home.four==null) {
        this.penalties.home.four = true
        this.penalties.home.total = this.penalties.home.total + 1

      } else if (this.penalties.home.five==null) {
        this.penalties.home.five = true
        this.penalties.home.total = this.penalties.home.total + 1
        this.penalties.home.reset = true

      } else {
        this.penalties.home.one = null
        this.penalties.home.two = null
        this.penalties.home.three = null
        this.penalties.home.four = null
        this.penalties.home.five = null
        if(this.penalties.away.reset) {
          this.penalties.away.one = null
          this.penalties.away.two = null
          this.penalties.away.three = null
          this.penalties.away.four = null
          this.penalties.away.five = null
          this.penalties.home.reset = false
          this.penalties.away.reset = false
        }
      }
      break;
      case 'away':
            if (this.penalties.away.one==null) {
        this.penalties.away.one = true
        this.penalties.away.total = this.penalties.away.total + 1

      } else if (this.penalties.away.two==null) {
        this.penalties.away.two = true
        this.penalties.away.total = this.penalties.away.total + 1

      } else if (this.penalties.away.three==null) {
        this.penalties.away.three = true
        this.penalties.away.total = this.penalties.away.total + 1

      } else if (this.penalties.away.four==null) {
        this.penalties.away.four = true
        this.penalties.away.total = this.penalties.away.total + 1

      } else if (this.penalties.away.five==null) {
        this.penalties.away.five = true
        this.penalties.away.total = this.penalties.away.total + 1
        this.penalties.away.reset = true

      } else {
        this.penalties.away.one = null
        this.penalties.away.two = null
        this.penalties.away.three = null
        this.penalties.away.four = null
        this.penalties.away.five = null
        if (this.penalties.home.reset) {
          this.penalties.home.one = null
          this.penalties.home.two = null
          this.penalties.home.three = null
          this.penalties.home.four = null
          this.penalties.home.five = null
          this.penalties.home.reset = false
          this.penalties.away.reset = false
        }
      }
        break;
  }
}
missed(side) {
  switch (side) {
    case 'home':
      if (this.penalties.home.one==null) {
        this.penalties.home.one = false

      } else if (this.penalties.home.two==null) {
        this.penalties.home.two = false

      } else if (this.penalties.home.three==null) {
        this.penalties.home.three = false

      } else if (this.penalties.home.four==null) {
        this.penalties.home.four = false

      } else if (this.penalties.home.five==null) {
        this.penalties.home.five = false
        this.penalties.home.reset = true

      } else {
        this.penalties.home.one = null
        this.penalties.home.two = null
        this.penalties.home.three = null
        this.penalties.home.four = null
        this.penalties.home.five = null
        if(this.penalties.away.reset) {
          this.penalties.away.one = null
          this.penalties.away.two = null
          this.penalties.away.three = null
          this.penalties.away.four = null
          this.penalties.away.five = null
          this.penalties.home.reset = false
          this.penalties.away.reset = false
        }
      }
      break;
      case 'away':
            if (this.penalties.away.one==null) {
        this.penalties.away.one = false

      } else if (this.penalties.away.two==null) {
        this.penalties.away.two = false

      } else if (this.penalties.away.three==null) {
        this.penalties.away.three = false

      } else if (this.penalties.away.four==null) {
        this.penalties.away.four = false
        
      } else if (this.penalties.away.five==null) {
        this.penalties.away.five = false
        this.penalties.away.reset = true

      } else {
        this.penalties.away.one = null
        this.penalties.away.two = null
        this.penalties.away.three = null
        this.penalties.away.four = null
        this.penalties.away.five = null
        if(this.penalties.home.reset) {
          this.penalties.home.one = null
          this.penalties.home.two = null
          this.penalties.home.three = null
          this.penalties.home.four = null
          this.penalties.home.five = null
          this.penalties.home.reset = false
          this.penalties.away.reset = false
        }
      }
        break;
  }
}

  async viewmatch(state, item, a) {
this.hgv =0;
this.agv=0;
this.penalties = {
  home: {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    total: 0,
    reset: false
  },
  away: {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    total: 0,
    reset: false
  },
  homeTotal: 0,
  awayTotal: 0
}




    console.log(item)
   



    
 this.zone.run(()=>{
  
  if(item ==null)
  {

  }
  else


  if(item.half==undefined)
  {

this.ascore=item.ascore;
this.score =item.score;
this.disableall =true;
    this.btn1 =false;
    this.btn2=true;
    this.btntxt ="";
    this.serve.matchstatus ="First Half";
  }
  else if(item.half == "First Half")
  {

    this.ascore=item.ascore;
    this.score =item.score;

    this.disableall =false
this.btn1 =false;
this.btn2=true;
this.serve.matchstatus ="Second Half";
this.btntxt ="First Half";
  }
  else if(item.half== "Second Half")
  {
    this.disableall =false
    this.ascore=item.ascore;
    this.score =item.score;
    console.log('Someting')

    this.serve.matchstatus ="Second Half";
this.btntxt ="Second Half";
this.btn1 =true;
this.btn2=false;
  }


  if (item == null) {

  } else {
    this.position = a;
    if (this.allserve.blocker == false && this.position != null) {

    }
    else {
      this.currmatch = [];
      this.matchobject = item;
      this.currmatch.push(item);
      console.log('line 205 ', this.matchobject.matchstate);
      if(this.matchobject.matchstate=="complete")
      {
        this.btntxt ="Full Time";
      }

      firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(async val => {
        this.team1 = [];
        this.input.data = [];
        let num = 0
        val.forEach(res => {
          this.team1.push({...{docid:res.id},...res.data()})
          console.log("147= ", this.team1)
          let ress =res.data()
         

   

         
             
                this.input.data.push({ name: "radio", type: 'radio', label: ress.fullName, value: num })
              
              num = num+1

              console.log(num)
            

        

 
        })
        console.log("Hplayers = ", this.input.data)  
      })

      firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
        this.team2 = [];
        this.ainput.data = [];
        let num = 0
        val.forEach(res => {
          this.team2.push({...{docid:res.id},...res.data()})
          console.log("385 = ", this.team2)

          this.ainput.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: num })
          num = num+1
        })

        console.log("Aplayers = ", this.ainput.data)
      })
    }
  }
  switch (state) {
    case 'open':
      this.viewingMatch = true
      this.renderer.setStyle(this.viewMatchDiv[0], 'display', 'flex')
      setTimeout(() => {

      }, 100);
      break;
    case 'close':
      this.viewingMatch = false
      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ mins: this.mins, secs: this.secs }).then(res => {
        console.log(res)
      })
      setTimeout(() => {
        this.renderer.setStyle(this.viewMatchDiv[0], 'display', 'none')
      }, 500);
      break;
    default:
      break;
  }
 })
  }

  segmentChanged(state) {
    this.zone.run(() => {
      let summaryORlineup = state.target.value;
      switch (summaryORlineup) {
        case 'lineup':
          this.matchView = summaryORlineup
          console.log('viewing ', summaryORlineup);
          break;
        case 'summary':
          this.matchView = summaryORlineup
          console.log('viewing ', summaryORlineup);
          break;
        default:
          break;
      }
    })
  }

  viewPlayer(state, side, playerObj, val) {
    console.log("player obj", this.playerobj)

    // state check if we are opening or closing the player details div
    switch (state) {
      case 'open':
        // if open, check for which side
        if (side == "home") {
          this.viewTeam('close', 'home', null)
          this.viewingPlayer.home = true;

          this.playerobj = []
          this.playerobj.push(playerObj);
          this.renderer.setStyle(this.homePlayerDiv[0], 'display', 'block')
        } else {

          this.aplayerobj = []
          this.aplayerobj.push(playerObj);

          this.viewTeam('close', 'away', null)
          this.viewingPlayer.away = true;
          this.renderer.setStyle(this.awayPlayerDiv[0], 'display', 'block')
        }
        break;
      case 'close':
        if (side == "home") {
          this.viewingPlayer.home = false;
          setTimeout(() => {
            // this.renderer.setStyle(this.homePlayerDiv[0], 'display', 'none')
          }, 500);
        } else {
          this.viewingPlayer.away = false;
          setTimeout(() => {
            // this.renderer.setStyle(this.awayPlayerDiv[0], 'display', 'none')
          }, 500);
        }
        break;
      default:
        break;
    }
  }
  viewTeam(state, side, teamObj) {
    switch (state) {
      case 'open':
        if (side == "home") {

          this.viewingTeam.home = true;
          this.renderer.setStyle(this.homeTeamDiv[0], 'display', 'block');
          console.log('home team open');
          this.viewPlayer('close', 'home', null, 0);
        } else {
          this.viewPlayer('close', 'away', null, 0);
          this.viewingTeam.away = true;
          this.renderer.setStyle(this.awayTeamDiv[0], 'display', 'block');
          console.log('Away team open');

        }
        break;
      case 'close':
        if (side == "home") {
          this.viewingTeam.home = false;
          setTimeout(() => {
            this.renderer.setStyle(this.homeTeamDiv[0], 'display', 'none');
          }, 500);
        } else {
          console.log('close away');

          this.viewingTeam.away = false;
          setTimeout(() => {
            this.renderer.setStyle(this.awayTeamDiv[0], 'display', 'none');
          }, 500);
        }
        break;
      default:
        break;
    }
  }
  // actions for the playing match
  matchAction(state, side) {
    // check the state of the action, are we opening or closing the panel
    switch (state) {
      case 'open':
        // check for which side the action is done
        if (side == 'home') {
          this.matchActionState.home = true
          this.renderer.setStyle(this.homePlayerActions[0], 'display', 'block')
        } else {
          this.matchActionState.away = true
          this.renderer.setStyle(this.awayPlayerActions[0], 'display', 'block')
        }
        break;
      case 'close':
        if (side == 'home') {
          this.matchActionState.home = false
          setTimeout(() => {
            this.renderer.setStyle(this.homePlayerActions[0], 'display', 'none')
          }, 500);
        } else {
          this.matchActionState.away = false
          setTimeout(() => {
            this.renderer.setStyle(this.awayPlayerActions[0], 'display', 'none')
          }, 500);
        }
        break;

      default:
        break;
    }
  }


  viewchildren(x, ind) {
    this.selectedTorun = ind

    // this.clicked = [];
    // this.fixture = [];
    if (this.timeLineIndx==ind) {
      this.timeLineIndx = null
    } else {
      this.timeLineIndx = ind
    }
    this.activeTourn = x
    // console.log(this.activeTourn.docid)
    // this.clicked.push(x);
    // console.log('line 404', this.activeTourn)
    // console.log(parseFloat(this.clicked[0].formInfo.type))
this.childrenarray =[]
    firebase.firestore().collection('newTournaments').where('formInfo.tournamentName','==',this.activeTourn.formInfo.tournamentName).where('parent','==','no').get().then(res=>{
      res.forEach(val=>{
        this.childrenarray.push({...{docid:val.id},...val.data()})
        console.log("Weee = ", this.childrenarray)
      })
    }) 
  }
  childreDetails(det, ind) {
    this.clicked = []
    this.selectedTorun = ind
    this.activeTourn = det
    console.log(this.activeTourn);
    this.clicked.push(det);
    if (det.state == 'finished') {
      // finnished matches
      this.db.collection('PlayedMatches').where('tournid', '==', det.docid).orderBy("matchdate", "desc").get().then(res => {

        this.match = {
          type1: [],// 1
          type2: [],// 2
          type4: [], // 8
          type8: [], // 16
          type16: [], // 32
          winner: {}
        }
        res.forEach(doc => {
          // CHECK WICH MATCH TYPE IS WHICH AND PUSH IT INTO THE RESPECTIVE ARRAY
          if (doc.data().type == '16') {
            this.match.type16.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '8') {
            this.match.type8.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '4') {
            this.match.type4.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '2') {
            this.match.type2.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '1') {
            this.match.type1.push({ ...{ fixtureid: doc.id }, ...doc.data() })
            if (doc.data().score >= 1) {
              this.match.winner = doc.data().TeamObject
            } else {
              this.match.winner = doc.data().aTeamObject
            }
          }
        })
        this.checkMatches()
        console.log(this.match);

      }).catch(err => { console.log(err); })
    } else {
      // these are upcoming ur inplay matches
      this.db.collection('MatchFixtures').where('tournid', '==', det.docid).onSnapshot(val => {
        this.fixture = [];
        val.forEach(res => {
          this.fixtureid = res.id;
          this.fixture.push({ ...{ fixtureid: res.id }, ...res.data() });
          console.log("Fixture Id = ", this.fixtureid)


        })
      })
    }
  }
  async viewdetails(x, ind) {
    this.timeLineIndx = null
    this.selectedTorun = ind


    this.clicked = [];
    this.fixture = [];

    this.activeTourn = x
    console.log(this.activeTourn.docid)
    this.clicked.push(x);
    console.log('line 404', this.activeTourn)
    console.log(parseFloat(this.clicked[0].formInfo.type))
this.childrenarray =[]
    firebase.firestore().collection('newTournaments').where('formInfo.tournamentName','==',this.activeTourn.formInfo.tournamentName).where('parent','==','no').get().then(res=>{
      res.forEach(val=>{
        this.childrenarray.push(val.data())
        console.log("Weee = ", this.childrenarray)
      })
    }) 


    if (x.state == 'finished') {

      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Do you want to restore this tournament so that it can be played again?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler:async () => {
              console.log('Confirm Okay');
              firebase.firestore().collection('newTournaments').doc(this.activeTourn.docid).update({"state":'newTournament',"approved":true,'message':'Previously Played!'});
              const toast = await this.toastController.create({
                message: 'Tournament restored succesfully.',
                duration: 4000
              });
              toast.present();
           
            }
          }
        ]
      });
  
      await alert.present();

      // finnished matches
      this.db.collection('PlayedMatches').where('tournid', '==', x.docid).orderBy("matchdate", "desc").get().then(res => {

        this.match = {
          type1: [],// 1
          type2: [],// 2
          type4: [], // 8
          type8: [], // 16
          type16: [], // 32
          winner: {}
        }
        res.forEach(doc => {
          // CHECK WICH MATCH TYPE IS WHICH AND PUSH IT INTO THE RESPECTIVE ARRAY
          if (doc.data().type == '16') {
            this.match.type16.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '8') {
            this.match.type8.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '4') {
            this.match.type4.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '2') {
            this.match.type2.push({ ...{ fixtureid: doc.id }, ...doc.data() })
          } else if (doc.data().type == '1') {
            this.match.type1.push({ ...{ fixtureid: doc.id }, ...doc.data() })
            if (doc.data().score >= 1) {
              this.match.winner = doc.data().TeamObject
            } else {
              this.match.winner = doc.data().aTeamObject
            }
          }
        })
        this.checkMatches()
        console.log(this.match);

      }).catch(err => { console.log(err); })
    } else {
      // these are upcoming ur inplay matches
      this.db.collection('MatchFixtures').where('tournid', '==', x.docid).onSnapshot(val => {
        this.fixture = [];
        val.forEach(res => {
          this.fixtureid = res.id;
          this.fixture.push({ ...{ fixtureid: res.id }, ...res.data() });
          console.log("Fixture Id = ", this.fixtureid)


        })
      })
    }
  }
  checkMatches() {
    if (this.match.type16.length > 0) {
      this.fixture = this.match.type16
      this.pastMatchCat = 'top32'
    } else if (this.match.type8.length > 0) {
      this.fixture = this.match.type8
      this.pastMatchCat = 'top16'
    } else {
      this.fixture = this.match.type4
      this.pastMatchCat = 'top8'
    }
  }
  finnishedMatchSegment(ev) {
    let event = ev.detail.value;
    switch (event) {
      case 'top32':
        this.fixture = this.match.type16
        break;
      case 'top16':
        this.fixture = this.match.type8
        break;
      case 'top8':
        this.fixture = this.match.type4
        break;
      case 'top4':
        this.fixture = this.match.type2
        break;
      case 'top1':
        this.fixture = this.match.type1
        break;
    }
  }
  async stop() {

   

    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      duration: 100
    });
    await loading.present();

    loading.onDidDismiss().then(async val => {
      if(this.serve.matchstatus != "Second Half")
      {
        const alert = await this.alertController.create({
          subHeader:'The match can not be complete if it is not in the \'Second Half\'.',
          message: 'Would you like to update?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Yes',
              handler: () => {
                console.log('Confirm Okay');
                


this.serve.matchstatus="Second Half";

this.stop()

              }
            }
          ]
        });
    
        await alert.present();
      }
else
      if (this.btn2 == false) {

        const alert = await this.alertController.create({
          header: 'Confirm!',
          message: 'Is the current match over?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: async (blah) => {
                console.log('Confirm Cancel: blah');

                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ matchstate: 'incomplete' });

                if (this.score+this.hgv == this.ascore+this.agv) {

                  console.log('This one')
                  const alert = await this.alertController.create({
                    header: 'Alert!',
                    message: 'The match can not be finished without a winner.',
                    buttons: ['OK']
                  });

                  await alert.present();
                  alert.onDidDismiss().then(res=>{
                    this.penaltiesPanel('open')
                  })
                }




















                

              }
            }, {
              text: 'Yes',
              handler: () => {
                
                // this.matchAction('close', 'away')
                console.log('Confirm Okay');

                // this.viewmatch('close', null,null);

               







                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ matchstate: 'complete' });

                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(async rez => {
                  console.log(rez.data().aTeamObject.teamName)


                  if (rez.data().score +this.hgv == rez.data().ascore+this.agv) {
                    console.log('This one')
                  
                    const alert = await this.alertController.create({
                      header: 'Alert!',
                      message: 'The match can not be finished without a winner.',
                      buttons: ['OK']
                    });

                    await alert.present();
                    alert.onDidDismiss().then(res=>{
                      this.penaltiesPanel('open')
                    })
                  }
                  else
                    if (parseFloat(rez.data().type) / 2 == 0.5) {


                   
        
                        console.log('Teams',this.currmatch[0].aTeamObject.uid,this.currmatch[0].TeamObject.uid)
                        firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
                          val.forEach(res => {
                            
                      firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').doc(res.id).update({status:'not available'})
                      
                            
                          })
                      
                         
                        })
                      
                      
                      
                        firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(val => {
                          val.forEach(res => {
                            
                      firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').doc(res.id).update({status:'not available'}).then(res=>{
                      console.log(res,'Done')
                      })
                      
                            
                          })
                      
                         
                        })
                      
                      














                    
                      // this.viewmatch('close', null, null)
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({half:'Match Over' });
                      
                        
                        })

                      this.db.collection('newTournaments').doc(this.clicked[0].docid).update({ state: 'finished' });
                      firebase.firestore().collection('newTournaments').doc(this.clicked[0].docid).update({ formInfo: { bio: this.clicked[0].formInfo.bio,applicationClosing: this.clicked[0].formInfo.applicationClosing, tournamentName: this.clicked[0].formInfo.tournamentName, location: this.clicked[0].formInfo.location, joiningFee: this.clicked[0].formInfo.joiningFee, endDate: this.clicked[0].formInfo.endDate, startDate: this.clicked[0].formInfo.startDate, type: "0" } });

                      if (rez.data().ascore+this.agv > rez.data().score +this.hgv) {

                        if(this.hgv>0 || this.agv>0)
                        {
                          console.log('Penalties')
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({hpenalties:this.hgv,apenalties:this.agv})
                        }else{ console.log('No Penalties')}

                        console.log("Away hi There",rez.data().ascore+this.agv > rez.data().score +this.hgv)
                        const alert = await this.alertController.create({
                          header: 'Result.',
                          message: 'Away team won the tournament!.',
                          buttons: ['OK']
                        });
                        alert.present()
                        firebase.firestore().collection('PlayedMatches').add(rez.data());


                        firebase.firestore().collection('TournamentWinners').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().aTeamObject } });


                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();

                      }
                      else if (rez.data().score +this.hgv> rez.data().ascore+this.agv) {
                        
                        console.log("Home hi There",rez.data().score +this.hgv> rez.data().ascore+this.agv)


                        const alert = await this.alertController.create({
                          header: 'Result.',
                          message: 'Home team won the tournament!.',
                          buttons: ['OK']
                        });
                        alert.present()

                        if(this.hgv>0 || this.agv>0)
                        {
                          console.log('Penalties')
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({hpenalties:this.hgv,apenalties:this.agv})
                        }else{ console.log('No Penalties')}



                     



  console.log('Teams',this.currmatch[0].aTeamObject.uid,this.currmatch[0].TeamObject.uid)
  firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
    val.forEach(res => {
      
firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').doc(res.id).update({status:'not available'})

      
    })

   
  })



  firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(val => {
    val.forEach(res => {
      
firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').doc(res.id).update({status:'not available'}).then(res=>{
console.log(res,'Done')
})

      
    })

   
  })


                        
                        
                        
                        this.viewmatch('close', null, null)
                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({half:'Match Over' });
                        
                          
                          })

                        firebase.firestore().collection('PlayedMatches').add(rez.data());

                        firebase.firestore().collection('TournamentWinners').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().TeamObject } });

                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();

                      }

                    }
                    else
                      if (rez.data().ascore +this.agv> rez.data().score+this.hgv) {
                        console.log("AWAYSCORE WON")
                        if(this.hgv>0)
                        {
                          console.log('Penalties')
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({hpenalties:this.hgv,apenalties:this.agv})
                        }else{ console.log('No Penalties')}



                                                const alert = await this.alertController.create({
                          header: 'Result.',
                          message: 'Away team won!.',
                          buttons: ['OK']
                        });
                    
                        await alert.present();




                        if(true)
                        {
                        
                        
                          console.log('Teams',this.currmatch[0].aTeamObject.uid,this.currmatch[0].TeamObject.uid)
                          firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
                            val.forEach(res => {
                              
                        firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').doc(res.id).update({status:'not available'})
                        
                              
                            })
                        
                           
                          })
                        
                        
                        
                          firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(val => {
                            val.forEach(res => {
                              
                        firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').doc(res.id).update({status:'not available'}).then(res=>{
                        console.log(res,'Done')
                        })
                        
                              
                            })
                        
                           
                          })
                        
                        }












                        this.viewmatch('close', null, null)
                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({half:'Match Over' });
                        
                          
                          })
                        firebase.firestore().collection('PlayedMatches').add(rez.data());

                        firebase.firestore().collection('participants').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().aTeamObject, ...{ type: (parseFloat(rez.data().type)).toString() } } });

                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();

                      }
                      else if (rez.data().score + this.hgv > rez.data().ascore +this.agv) {
                        
                        if(this.hgv>0 || this.agv>0)
                        {
                          console.log('Penalties')
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({hpenalties:this.hgv,apenalties:this.agv})
                        }else{ console.log('No Penalties')}
                        
                        
                        if(true)
{


  console.log('Teams',this.currmatch[0].aTeamObject.uid,this.currmatch[0].TeamObject.uid)
  firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
    val.forEach(res => {
      
firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').doc(res.id).update({status:'not available'})

      
    })

   
  })



  firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(val => {
    val.forEach(res => {
      
firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').doc(res.id).update({status:'not available'}).then(res=>{
console.log(res,'Done')
})

      
    })

   
  })

}
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        console.log("HOMESCORE WON")

                        const alert = await this.alertController.create({
                          header: 'Result.',
                          message: 'Home team won!.',
                          buttons: ['OK']
                        });
                    
                        await alert.present();



                        this.viewmatch('close', null, null)
                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
                          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({half:'Match Over' });
                        
                          
                          })
                        firebase.firestore().collection('PlayedMatches').add(rez.data());


                        firebase.firestore().collection('participants').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().TeamObject, ...{ type: (parseFloat(rez.data().type)).toString() } } });


                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();
                        this.clicked = [];

                      }

                })
              }
            }
          ]
        });

        await alert.present();
      }
    });
  }




  async goal1() {

    {
      this.currentmatch = [];
      console.log("click", this.currmatch[0].id);

      this.goals = [];



      const alert = await this.alertController.create({
        header: 'Home',
        subHeader: 'Pick Goal scorer',
        inputs: this.input.data,
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


              console.log(this.matchobject)
              firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
                

                console.log(val.data())
                let obj = val.data();
                obj.score = parseFloat(obj.score) + 1;
                this.score = obj.score;



                this.goals = obj.goal;

                this.id = val.id;



                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ score: this.score, mins: this.mins, secs: this.secs });


                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                  goal: firebase.firestore.FieldValue.arrayUnion({
                    scoretime: this.mins.toString() +
                      ":" + this.secs.toString(), goalscorer: data
                  })
                })
              })
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async goal2() {
    {
      this.currentmatch = [];
      this.agoals = [];
      const alert = await this.alertController.create({
        header: 'Away',
        subHeader: 'Pick Goal scorer',
        inputs: this.ainput.data,
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
              firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                
                console.log(res.data())
                let obj = res.data();
                obj.ascore = parseFloat(obj.ascore) + 1;
                this.ascore = obj.ascore;

                console.log(obj.agoal)
                console.log(obj.ascore)

                this.agoals = obj.agoal;
                console.log(this.agoals)
                this.currentmatch.push(obj);
                this.id = res.id;
                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ ascore: this.ascore, mins: this.mins, secs: this.secs });
                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                  agoal: firebase.firestore.FieldValue.arrayUnion({
                    scoretime: this.mins.toString() +
                      ":" + this.secs.toString(), goalscorer: data
                  })
                })
              })
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async homestats(x) {
    console.log(x)

    {
      console.log(this.input)
      let input = this.input;
      console.log(input);
      const alert = await this.alertController.create({
        header: 'Home: ' + x,
        subHeader: 'Pick Player',
        inputs: input.data,
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
            handler: async (data) => {
              console.log(data);

              if (x == "yellow") {
                this.currmatch = [];
                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                  stats: firebase.firestore.FieldValue.arrayUnion({
                    yellow: this.mins.toString() +
                      ":" + this.secs.toString(), playerName: data
                  })
                })
                console.log("yellow")

                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                  res.data();
                  let obj = res.data();
                  obj.yellow = obj.yellow + 1;

                  this.currmatch.push(obj);
                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ yellow: obj.yellow });

                })
              }  else if (x == "red") {
                  this.currmatch = [];
                  console.log("red")

                  console.log('currmatch id', this.currmatch);


                  firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').doc(this.team1[data].doc.id).update({red:this.matchobject.fixtureid})


                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                    res.data();
                    let obj = res.data();
                    obj.red = res.data().red + 1;
                    this.currmatch.push(obj);
                    console.log(this.currentmatch)

                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ red: obj.red });

                  })
                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                    stats: firebase.firestore.FieldValue.arrayUnion({
                      red: this.mins.toString() +
                        ":" + this.secs.toString(), playerName: data
                    })
                  })
                }

                else
                  if (x == "offsides") {

                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                      res.data();
                      let obj = res.data();
                      obj.offsides = res.data().offsides + 1;
                      this.currmatch.push(obj);
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ offsides: obj.offsides });
                    })

                    this.currmatch = [];
                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                      stats: firebase.firestore.FieldValue.arrayUnion({
                        offsides: this.mins.toString() +
                          ":" + this.secs.toString(), playerName: data
                      })
                    })
                  }


                  else
                    if (x == "corners") {
                      this.currmatch = [];
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                        stats: firebase.firestore.FieldValue.arrayUnion({
                          corners: this.mins.toString() +
                            ":" + this.secs.toString(), playerName: data
                        })
                      })


                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                        res.data();
                        let obj = res.data();
                        obj.corners = res.data().corners + 1;

                        this.currmatch.push(obj);
                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ corners: obj.corners });
                      })
                    }
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async awaystats(x) {
    console.log(x)
    {

      let input = this.ainput;




      console.log(input);
      const alert = await this.alertController.create({
        header: 'Away',
        subHeader: 'Pick event',
        inputs: input.data,
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






              if (x == "yellow") {
                this.currmatch = [];


                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                  stats: firebase.firestore.FieldValue.arrayUnion({
                    ayellow: this.mins.toString() +
                      ":" + this.secs.toString(), playerName: data
                  })
                })


                // firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.userUID).collection('Players').doc(this.id).update({yellow:1});


                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                  res.data();
                  let obj = res.data();
                  obj.ayellow = obj.ayellow + 1;
                  console.log(obj)
                  this.currmatch.push(obj);
                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ ayellow: obj.ayellow });

                })


              }

              else
                if (x == "red") {
                  this.currmatch = [];
                  console.log("red")

                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                    res.data();
                    let obj = res.data();
                    obj.ared = res.data().ared + 1;
                    this.currmatch.push(obj);
                    console.log(res.data().ared + 1)

                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ ared: obj.ared });

                  })
                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                    stats: firebase.firestore.FieldValue.arrayUnion({
                      ared: this.mins.toString() +
                        ":" + this.secs.toString(), playerName: data
                    })
                  })
                }

                else
                  if (x == "offsides") {

                    this.currmatch = [];

                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                      res.data();
                      let obj = res.data();
                      obj.aoffsides = res.data().aoffsides + 1;
                      console.log(obj)
                      this.currmatch.push(obj);
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ aoffsides: obj.aoffsides });
                    })


                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                      stats: firebase.firestore.FieldValue.arrayUnion({
                        aoffsides: this.mins.toString() +
                          ":" + this.secs.toString(), playerName: data
                      })
                    })
                  }


                  else
                    if (x == "corners") {
                      this.currmatch = [];
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({
                        stats: firebase.firestore.FieldValue.arrayUnion({
                          acorners: this.mins.toString() +
                            ":" + this.secs.toString(), playerName: data
                        })
                      })


                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                        res.data();
                        let obj = res.data();

                        obj.acorners = res.data().acorners + 1;

                        console.log(obj)

                        this.currmatch.push(obj);
                        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ acorners: obj.acorners });
                      })
                    }








            }
          }
        ]
      });
      await alert.present();
    }
  }

  changeview(clickedbutton) {
    this.selectedTorun = null
    this.clicked = [];
    this.fixture = [];
    this.timeLineIndx = null
    console.log(clickedbutton)
    switch (clickedbutton) {
      // gets all approved tournaments tournaments
      case 'all':
        this.filterBy = clickedbutton
        this.db.collection('newTournaments').where('approved', '==', true).where('parent','==','yes').orderBy('state', 'desc').get().then(res => {
          this.tournament = [];
          res.forEach(doc => {
            console.log(doc.data())
            this.tournament.push({ ...{ docid: doc.id }, ...doc.data() })
          })
        });
        break;

      // gets all approved tournaments with a state of newTournament
      case 'newTournament':
        this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", clickedbutton).get().then(res => {
          this.tournament = [];
          res.forEach(doc => {
            console.log(doc.data())
            this.tournament.push({ ...{ docid: doc.id }, ...doc.data() })

          })
        });
        this.filterBy = clickedbutton
        break;

      // gets all tournaments with a state of in progress
      case 'inprogress':
        this.filterBy = clickedbutton
        this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", clickedbutton).onSnapshot(res => {
          this.tournament = [];
          res.forEach(doc => {
            console.log(doc.data())
            this.tournament.push({ ...{ docid: doc.id }, ...doc.data() })

          })
        });
        break;

      // gets all tournaments with a state of finnished
      case 'finished':
        this.filterBy = clickedbutton
        this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", clickedbutton).where('parent','==','yes').get().then(res => {
          this.tournament = [];
          res.forEach(doc => {
            console.log(doc.data())
            this.tournament.push({ ...{ docid: doc.id }, ...doc.data() })

          })
        });
        break;
    }
  }

  async alterminutes() {
    const alert = await this.alertController.create({
      header: 'Time Adjustment!',
      inputs: [
        {
          name: 'time',
          type: 'number',
          placeholder: 'Enter the number of minutes.'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: (time) => {
            console.log('Confirm Okay', time.time);
            this.mins = parseFloat(time.time.toString());
            console.log(parseFloat(time.time.toString()))
          }
        }
      ]
    });

    await alert.present();
  }


cick =0;
  async radio()
  {
console.log(this.serve.matchstatus)

this.disableall =false;

 if(this.serve.matchstatus == "First Half")
{
this.btn1 =false;
this.btn2=true;


firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({half:this.serve.matchstatus });

  
  })

const loading = await this.loadingController.create({
  message: 'Updating match division...',
  duration: 4000
});
await loading.present();

const { role, data } = await loading.onDidDismiss();


  



console.log('Loading dismissed!');
const toast = await this.toastController.create({
  message: 'This match is now in the '+this.serve.matchstatus,
  duration: 4000
});
toast.present();

this.btn1 =false;
this.btn2=true;
this.btntxt ='First Half';
this.serve.matchstatus ="Second Half";


}
else
if(this.serve.matchstatus == "Second Half")
{
this.btn1 =false;
this.btn2=true;
this.btntxt ='Second Half';

const loading = await this.loadingController.create({
  message: 'Updating match division...',
  duration: 4000
});
await loading.present();

const { role, data } = await loading.onDidDismiss();

console.log('Loading dismissed!');
const toast = await this.toastController.create({
  message: 'This match is now in the '+this.serve.matchstatus,
  duration: 4000
});
toast.present();

firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({half:this.serve.matchstatus });

})
this.btn1 =true;
this.btn2=false;

}





}
  

endpenalty()
{
  this.stop()
// this.viewmatch('close', null, null);

this.penaltiesPanel('close')
}


}