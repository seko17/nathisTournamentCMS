import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { AllserveService } from 'src/app/services/allserve.service';
import * as firebase from 'firebase';
import { Subscription, Observable, observable, timer } from 'rxjs';
import { AlertController } from '@ionic/angular';
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
    away: true,
    home: true
  }
  activeFilter = {
    all: true,
    inplay: false,
    upcoming: false
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
  matchView = 'lineup';
  // ___________________________________________
  // BEGGIN BACKEND HERE
  tournament;
  approvedTournaments = [];
  db = firebase.firestore();
  input = { data: [] };
  ainput = { data: [] };
  tempCardGen = [] // temporary card generator, used for ngFor
  constructor(public alertController: AlertController, public serve: AllserveService, public zone: NgZone, public renderer: Renderer2) {

    let tourn = {
      docid: null,
      doc: null,
      hasApplications: false
    }
    this.serve.tournaments = [];
    this.db.collection('newTournaments').where('approved', '==', true).get().then(res => {
      // this.approvedTournaments = []
      res.forEach(doc => {
        this.db.collection('newTournaments').doc(doc.id).collection('teamApplications').get().then(res => {
          if (res.empty) {
            tourn = {
              docid: doc.id,
              doc: doc.data(),
              hasApplications: false
            }
            this.approvedTournaments.push(tourn);
            this.viewdetails(this.tournament[0])
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
            this.viewdetails(this.tournament[0])
            tourn = {
              docid: null,
              doc: null,
              hasApplications: false
            }
          }

        })
      })
      // console.log('approvedTournaments ', this.approvedTournaments);
      this.tournament = this.approvedTournaments;

      console.log("Menu = ", this.tournament)
    })
  }

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
  viewmatch(state, item) {
    console.log('item = ', item);
    if (item) {
      this.matchobject = item;
    this.currmatch.push(item);
    } else {
      this.currmatch = []
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
  viewPlayer(state, side, playerObj) {
    switch (state) {
      case 'open':
        if (side == "home") {
          this.viewTeam('close', 'home', null)
          this.viewingPlayer.home = true;
          this.renderer.setStyle(this.homePlayerDiv[0], 'display', 'block')
        } else {
          this.viewTeam('close', 'away', null)
          this.viewingPlayer.away = true;
          this.renderer.setStyle(this.awayPlayerDiv[0], 'display', 'block')
        }
        break;
      case 'close':
        if (side == "home") {
          this.viewingPlayer.home = false;
          setTimeout(() => {
            this.renderer.setStyle(this.homePlayerDiv[0], 'display', 'none')
          }, 500);
        } else {
          this.viewingPlayer.away = false;
          setTimeout(() => {
            this.renderer.setStyle(this.awayPlayerDiv[0], 'display', 'none')
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
          this.viewPlayer('close', 'home', null);
        } else {
          this.viewPlayer('close', 'away', null);
          this.viewingTeam.away = true;
          this.renderer.setStyle(this.awayTeamDiv[0], 'display', 'block');
          console.log('Away team open');
          this.goal2();
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
    this.fixture = [];
    console.log(x)
    this.clicked.push(x);
    this.db.collection('MatchFixtures').where('tournid', '==', x.docid).get().then(val => {
      val.forEach(res => {

        this.fixtureid = res.id;
        this.fixture.push({ ...{ fixtureid: res.id }, ...res.data() });
        console.log("Fixture Id = ", this.fixtureid)

        this.fixture.push({ ...{ fixtureid: res.id }, ...res.data() });
        console.log(this.fixture)




        firebase.firestore().collection('MatchFixtures').doc(res.id).get().then(val => {


          console.log(this.currentmatch)
          this.score = val.data().score;
          this.ascore = val.data().ascore;
          this.tourname = val.data().Tournament;
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


          // firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{

          //   val.forEach(res=>{

          //    this.id =res.id;
          //     this.matchstats.push(res.data());


          //   })

          // })


        })
      })
    })

  }

  team1 = [];
  team2 = [];

  fixtureid;

  firsthalf() {
    this.btn1 = true;
    this.btn2 = true;
    this.btn3 = false;


    console.log('docid = ', this.matchobject.fixtureid)
    this.sub = timer(0, 1000).subscribe(result => {

      this.matchobject.fixtureid

      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(val => {


        this.secs = val.data().secs;
        console.log("Team = ", val.data())

        console.log('docid = ', this.currmatch[0].fixtureid)
        this.sub = timer(0, 1000).subscribe(result => {
          this.mins = val.data().mins;
          if (this.secs == 60) {
            this.secs = 0;
            this.mins = this.mins + 1;

          }
          firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ mins: this.mins, secs: this.secs + 1 });
        })



      })

    })
    console.log("comp = ", this.currmatch[0].TeamObject.userUID)

    firebase.firestore().collection('Teams').doc(this.currmatch[0].TeamObject.userUID).collection('Players').get().then(val => {

      val.forEach(res => {
        // console.log( "players = ",res.data().fullName)

        this.team1.push(res.data())
        console.log("385 = ", this.team1)
        this.input.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
      })

    })

    firebase.firestore().collection('Teams').doc(this.currmatch[0].aTeamObject.userUID).collection('Players').get().then(val => {

      val.forEach(res => {
        console.log("players = ", res.data().fullName)
        this.team2.push(res.data())
        this.ainput.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
      })



      console.log("players = ", this.ainput.data)
    })

  }
  btn3 = true;
  async stop() {

    // this.btn1 =false;
    this.btn2 = false;
    this.btn3 = true;

    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Ae you sure you want to stop the match?',
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
            console.log(this.sub.unsubscribe())
          }
        }
      ]
    });

    await alert.present();

  }
  secondhalf() {
    this.btn1 = true;
    this.btn2 = true;
    this.btn3 = false;
    this.sub = timer(0, 1000).subscribe(result => {

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
              // this.currentmatch.push(obj);
              this.id = val.id;



              firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ score: this.score + 1 });


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

  agoals;
  async goal2() {
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

            firebase.firestore().collection('MatchFixtures').doc(this.currmatch[0].fixtureid).get().then(res => {

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

              firebase.firestore().collection('MatchFixtures').doc(this.currmatch[0].fixtureid).update({ ascore: this.ascore + 1 });

              firebase.firestore().collection('MatchFixtures').doc(this.currmatch[0].fixtureid).update({
                agoal: firebase.firestore.FieldValue.arrayUnion({
                  scoretime: this.mins.toString() +
                    ":" + this.timer.toString(), goalscorer: data
                })
              })
              // ({goal:[{scoretime:this.mins.toString()+this.timer.toString(),goalscorer:data }]}, { merge: true });
            })

          }
        }
      ]
    });
    await alert.present();
  }

  async homestats(x) {
    console.log(x)


    console.log(this.input)
    let input = this.input;

    // input.data.push({name:"radio",type: 'radio',label:"Shots",value:"shots"})
    // input.data.push({name:"radio",type: 'radio',label:"On Target",value:"ontarget"})
    // input.data.push({name:"radio",type: 'radio',label:"Foul",value:"fouls"})
    // input.data.push({name:"radio",type: 'radio',label:"Yellow Card",value:"yellow"})
    // input.data.push({name:"radio",type: 'radio',label:"Red Card",value:"red"})
    // input.data.push({name:"radio",type: 'radio',label:"Off Side",value:"offsides"})
    // input.data.push({name:"radio",type: 'radio',label:"Corner",value:"corners"})

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
          handler: (data) => {
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
                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ yellow: obj.yellow + 1 });

              })


            }

            else
              if (x == "red") {
                this.currmatch = [];
                console.log("red")

                firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).get().then(res => {
                  res.data();
                  let obj = res.data();
                  obj.red = res.data().red + 1;
                  this.currmatch.push(obj);
                  firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ red: obj.red + 1 });
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
                    firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ offsides: obj.offsides + 1 });
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
                      firebase.firestore().collection('MatchFixtures').doc(this.matchobject.fixtureid).update({ corners: obj.corners + 1 });
                    })
                  }

          }
        }
      ]
    });
    await alert.present();

  }

  async awaystats(x) {
    console.log(x)



    let input = this.ainput;

    // input.data.push({name:"radio",type: 'radio',label:"Shots",value:"ashots"})
    // input.data.push({name:"radio",type: 'radio',label:"On Target",value:"aontarget"})
    // input.data.push({name:"radio",type: 'radio',label:"Foul",value:"afouls"})
    // input.data.push({name:"radio",type: 'radio',label:"Yellow Card",value:"ayellow"})
    // input.data.push({name:"radio",type: 'radio',label:"Red Card",value:"ared"})
    // input.data.push({name:"radio",type: 'radio',label:"Off Side",value:"aoffsides"})
    // input.data.push({name:"radio",type: 'radio',label:"Corner",value:"acorners"})


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
            if (data == "ashots") {
              this.matchstats = [];
              firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                val.forEach(res => {
                  let val = res.data().ashots;
                  let obj = res.data();
                  obj.ashots = obj.ashots + 1;

                  this.matchstats.push(obj);
                  this.id = res.id;
                  console.log(this.id)
                  firebase.firestore().collection('Top4').doc(this.id).update({ ashots: val + 1 });

                })

              })

            }

            else

              if (data == "aontarget") {
                this.matchstats = [];
                firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                  val.forEach(res => {
                    let val = res.data().aontarget;
                    let obj = res.data();
                    obj.aontarget = obj.aontarget + 1;

                    this.matchstats.push(obj);
                    this.id = res.id;
                    console.log(this.id)
                    firebase.firestore().collection('Top4').doc(this.id).update({ aontarget: val + 1 });

                  })

                })

              }
              else
                if (data == "afouls") {
                  this.matchstats = [];
                  firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                    val.forEach(res => {
                      let val = res.data().afouls;
                      let obj = res.data();
                      obj.afouls = obj.afouls + 1;

                      this.matchstats.push(obj);
                      this.id = res.id;
                      console.log(this.id)
                      firebase.firestore().collection('Top4').doc(this.id).update({ afouls: val + 1 });

                    })

                  })
                }
                else
                  if (data == "ayellow") {
                    this.matchstats = [];
                    firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                      val.forEach(res => {
                        let val = res.data().ayellow;
                        let obj = res.data();
                        obj.ayellow = obj.ayellow + 1;

                        this.matchstats.push(obj);
                        this.id = res.id;
                        console.log(this.id)
                        firebase.firestore().collection('Top4').doc(this.id).update({ ayellow: val + 1 });

                      })

                    })

                  }

                  else
                    if (data == "ared") {
                      this.matchstats = [];
                      firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                        val.forEach(res => {
                          let val = res.data().ared;
                          let obj = res.data();
                          obj.ared = obj.ared + 1;

                          this.matchstats.push(obj);
                          this.id = res.id;
                          console.log(this.id)
                          firebase.firestore().collection('Top4').doc(this.id).update({ ared: val + 1 });

                        })

                      })
                    }

                    else
                      if (data == "aoffsides") {
                        this.matchstats = [];
                        firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                          val.forEach(res => {
                            let val = res.data().aoff;
                            let obj = res.data();
                            obj.aoff = obj.aoff + 1;

                            this.matchstats.push(obj);
                            this.id = res.id;
                            console.log(obj.shots)
                            firebase.firestore().collection('Top4').doc(this.id).update({ aoff: val + 1 });

                          })

                        })
                      }


                      else
                        if (data == "acorners") {
                          this.matchstats = [];
                          firebase.firestore().collection('Top4').where("Tournament", "==", this.tourname).get().then(val => {

                            val.forEach(res => {
                              let val = res.data().acorner;
                              let obj = res.data();
                              obj.acorner = obj.acorner + 1;

                              this.matchstats.push(obj);
                              this.id = res.id;
                              console.log(this.id)
                              firebase.firestore().collection('Top4').doc(this.id).update({ acorner: val + 1 });

                            })

                          })

                        }

          }
        }
      ]
    });
    await alert.present();
  }
  filterMatches(state) {
    switch (state) {
      case 'all':
        this.activeFilter = {
          all: true,
          inplay: false,
          upcoming: false
        }
        break;
        case 'inplay':
          this.activeFilter = {
            all: false,
            inplay: true,
            upcoming: false
          }
        break;
        case 'upcoming':
          this.activeFilter = {
            all: false,
            inplay: false,
            upcoming: true
          }
        break;
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
}