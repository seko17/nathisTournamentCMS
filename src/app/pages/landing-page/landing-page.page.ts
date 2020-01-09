
import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { AllserveService } from 'src/app/services/allserve.service';
import * as firebase from 'firebase';
import { Subscription, Observable, observable, timer } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
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
  filterBy = 'newTournament'
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BEGGIN BACKEND HERE



  tournament = [];
  toFilter = []
  adminProfile = {}
  approvedTournaments = [];
  db = firebase.firestore();
  input = { data: [] };
  ainput = { data: [] };
  tempCardGen = [] // temporary card generator, used for ngFor
  constructor(public loadingController: LoadingController,public allserve: AllserveService, public alertController: AlertController, public serve: AllserveService, public zone: NgZone, public renderer: Renderer2) {







    let tourn = {
      docid: null,
      doc: null,
      hasApplications: false
    }
    this.serve.tournaments = [];

    this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", "newTournament").get().then(res => {
      this.tournament = [];
      res.forEach(doc => {
        console.log(doc.data())
        this.tournament.push({ ...{ docid: doc.id }, ...doc.data() })

      })
      // console.log('approvedTournaments ', this.approvedTournaments);


      this.serve.firstdoc = this.tournament;
      console.log("Menu = ", tourn)
    })

    // 
















  }


 blocker =this.allserve.blocker;
  timer;
  docid;
  mins: number = 0;
  secs: number = 0;
  sub: Subscription;
  btntxt1 = "First Half";
  btntxt2 = "Second Half";
  btn1 = false;
  btn2 = true;
  currentmatch = [];


  ngOnInit() {

  }
  matchobject: any = {};
  currmatch = [];
  async viewmatch(state, item) {
    console.log('item = ', item);



    if (item == null) {

    }

    else {


      if (this.allserve.blocker == false) {
        const alert = await this.alertController.create({
          header: 'Alert',
          subHeader: 'There is a match currently in play',
          message: 'Click \'OK \' to continue.',
          buttons: ['OK']
        });

        await alert.present();
      }
      else {
        this.currmatch = [];
        this.matchobject = item;
        this.currmatch.push(item);




        firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(val => {
          this.team1 = [];
          val.forEach(res => {
            console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeew ")

            this.team1.push(res.data())
            console.log("147= ", this.team1)
            // this.input.data.push({name:"radio",type: 'radio',label:res.data().fullName,value:res.data().fullName})
          })
          // console.log( "players = ",this.input.data) 
        })


        firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
          this.team2 = [];
          val.forEach(res => {
            this.team2.push(res.data())
            console.log("385 = ", this.team2)

            // this.ainput.data.push({name:"radio",type: 'radio',label:res.data().fullName,value:res.data().fullName})
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
        setTimeout(() => {
          this.renderer.setStyle(this.viewMatchDiv[0], 'display', 'none')
        }, 500);
        break;
      default:
        break;
    }
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

  // keep in mind, the playerObj will pass null if were closing the panel
  playerobj = [];
  aplayerobj = [];
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


  clicked = [];

  fixture = [];
  viewdetails(x) {
    this.clicked = [];

    console.log(x)
    this.clicked.push(x);
    console.log(parseFloat(this.clicked[0].formInfo.type))

    this.db.collection('MatchFixtures').where('tournid', '==', x.docid).get().then(val => {
      this.fixture = [];
      val.forEach(res => {

        this.fixtureid = res.id;
        this.fixture.push({ ...{ fixtureid: res.id }, ...res.data() });
        console.log("Fixture Id = ", this.fixtureid)




        firebase.firestore().collection('MatchFixtures').doc(res.id).get().then(val => {


          // console.log(this.currentmatch)
          this.score = val.data().score;
          this.ascore = val.data().ascore;
          this.tourname = val.data().Tournament;
          this.mins = val.data().mins;
          this.secs = val.data().secs;
          this.score = val.data().score;
          this.ascore = val.data().ascore;
          if (val.data().mins > 0 && val.data().mins <= 46) {
            this.btntxt1 = "Resume First Half";
            this.btn1 = false;
            this.btn2 = true;
            this.btn3 = true;
          }
          else if (val.data().mins > 45 && val.data().mins <= 90) {
            this.btn1 = true;
            this.btn2 = false;
            this.btn3 = true;
            this.btntxt2 = "Resume Second Half";
          }


        })
      })
    })

  }






  team1 = [];
  team2 = [];





  fixtureid;

  firsthalf() {


    console.log("comp = ", this.currmatch[0].id)
    // console.log("comp = ",this.currmatch[0].aTeamObject.uid)

    firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.uid).collection('Players').get().then(val => {
      this.team1 = [];
      val.forEach(res => {
        console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeew ")

        this.team1.push(res.data())
        console.log("385 = ", this.team1)
        this.input.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
      })
      console.log("players = ", this.input.data)
    })


    firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.uid).collection('Players').get().then(val => {
      this.team2 = [];
      val.forEach(res => {
        this.team2.push(res.data())
        console.log("385 = ", this.team2)

        this.ainput.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
      })

      console.log("Aplayers = ", this.ainput.data)
    })

    this.btn1 = true;
    this.btn2 = true;
    this.btn3 = false;

    console.log('docid = ', this.matchobject.fixtureid)
    this.sub = timer(0, 1000).subscribe(result => {
     
      this.matchobject.fixtureid;
      this.allserve.blocker = false;
      this.blocker=this.allserve.blocker;
   

      if (this.secs == 60) {
        this.secs = 0;
        this.mins = this.mins + 1;

      }

      this.secs = this.secs + 1;

    })

  }
  btn3 = true;
  async stop() {

    // this.btn1 =false;

    console.log(this.clicked[0].docid)

    this.btn2 = false;
    this.btn3 = true;

    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to stop the match?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'YES',
          handler: () => {
            this.btn1 = true;
            this.btn2 = false;

            this.sub.unsubscribe();

            firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ mins: this.mins, secs: this.secs, type: this.clicked[0].formInfo.type }).then(res => {
              this.allserve.blocker = true;
              this.blocker=this.allserve.blocker;

            })


            this.allserve.blocker = true;
      this.blocker=this.allserve.blocker;

            console.log(this.sub.unsubscribe())
          }
        }
      ]
    });

    alert.onDidDismiss().then(async rez => {



      const loading = await this.loadingController.create({
        spinner: 'bubbles',
        duration: 5500
      });
      await loading.present();

loading.onDidDismiss().then(async val=>{


  if (this.btn3 == true) {

    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Is the current match over?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

            firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ matchstate: 'incomplete' });

          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');

            this.allserve.blocker = true;
            this.blocker=this.allserve.blocker;
            this.viewmatch('close', null);

            firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ matchstate: 'complete' });

            firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(rez => {
              console.log(rez.data().aTeamObject.teamName)

              if (parseFloat(this.clicked[0].formInfo.type) / 2 == 1) {

                this.db.collection('newTournaments').doc().update({ state: 'finished' });

                if (rez.data().ascore > rez.data().score) {
                  console.log("AWAYSCORE WON")

                  firebase.firestore().collection('PlayedMatches').add(rez.data());


                  firebase.firestore().collection('TournamentWinners').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().aTeamObject } });


                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();


                }
                else if (rez.data().score > rez.data().ascore) {
                  console.log("HOMESCORE WON")

                  firebase.firestore().collection('PlayedMatches').add(rez.data());


                  firebase.firestore().collection('TournamentWinners').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().TeamObject } });


                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();

                }

              }
              else
                if (rez.data().ascore > rez.data().score) {
                  console.log("AWAYSCORE WON")

                  firebase.firestore().collection('PlayedMatches').add(rez.data());


                  firebase.firestore().collection('participants').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().aTeamObject, ...{ type: (parseFloat(this.clicked[0].formInfo.type) / 2).toString() } } });


                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();


                }
                else if (rez.data().score > rez.data().ascore) {
                  console.log("HOMESCORE WON")

                  firebase.firestore().collection('PlayedMatches').add(rez.data());


                  firebase.firestore().collection('participants').add({ tournid: this.clicked[0].docid, TeamObject: { ...rez.data().TeamObject, ...{ type: (parseFloat(this.clicked[0].formInfo.type) / 2).toString() } } });


                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).delete();

                }

            })
          }
        }
      ]
    });

    await alert.present();
  }







  
});












     

    })
    await alert.present();
  }

  secondhalf() {
    this.btn1 = true; // first half
    this.btn2 = true; // resume
    this.btn3 = false; //
    console.log('docid = ', this.matchobject.fixtureid)

    this.allserve.blocker = false;
    this.blocker=this.allserve.blocker;

    this.sub = timer(0, 1000).subscribe(result => {

      this.allserve.blocker = false;
      this.blocker=this.allserve.blocker;


    this.allserve.blocker =true;
      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {
        this.secs = val.data().secs;
        console.log(val.data().secs)
        this.mins = val.data().mins;
        if (this.secs == 59) {
          this.secs = 0;
          this.mins = this.mins + 1;
        }
        firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ mins: this.mins, secs: this.secs + 1 });
      })
    })
  }

  score;
  ascore;
  tourname;
  id;
  matchstats = [];
  goals = [];
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
  agoals;
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

                // firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.userUID).collection('Players').doc(this.id).update({yellow:1});


                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                  res.data();
                  let obj = res.data();
                  obj.yellow = obj.yellow + 1;

                  this.currmatch.push(obj);
                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ yellow: obj.yellow });

                })


              }

              else
                if (x == "red") {
                  this.currmatch = [];
                  console.log("red")

                  console.log('currmatch id', this.currmatch);
                  
                



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
                console.log("yellow")

                // firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.userUID).collection('Players').doc(this.id).update({yellow:1});


                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                  res.data();
                  let obj = res.data();
                  obj.ayellow = obj.ayellow + 1;

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


                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ red: obj.ared });

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



                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                      res.data();
                      let obj = res.data();
                      obj.aoffsides = res.data().aoffsides + 1;
                      this.currmatch.push(obj);
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ aoffsides: obj.aoffsides });
                    })

                    this.currmatch = [];
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




  async ionViewWillLeave() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Warning!',
      message: 'Leaving this page during a match will pause any ongoing matches!',
      buttons: ['OK']
    });

    await alert.present();
    this.sub.unsubscribe();
  }

  changeview(clickedbutton) {
    this.clicked = [];
    this.fixture = [];
    console.log(clickedbutton)
    switch (clickedbutton) {
      // gets all approved tournaments tournaments
      case 'all':
        this.filterBy = clickedbutton
        this.db.collection('newTournaments').where('approved', '==', true).get().then(res => {
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
        this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", clickedbutton).get().then(res => {
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
        this.db.collection('newTournaments').where('approved', '==', true).where("state", "==", clickedbutton).get().then(res => {
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
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: (time) => {
            console.log('Confirm Okay' ,time.time);
            this.mins =parseFloat(time.time.toString());
            console.log(parseFloat(time.time.toString()))
          }
        }
      ]
    });

    await alert.present();
  }


}