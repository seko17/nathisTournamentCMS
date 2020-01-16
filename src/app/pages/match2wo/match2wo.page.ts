import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import {Match2Service} from '../../services/match2.service';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-match2wo',
  templateUrl: './match2wo.page.html',
  styleUrls: ['./match2wo.page.scss'],
})
export class Match2woPage implements OnInit {
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
    tempCardGen = [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    player = {
      home: {},
      away: {}
    } as any
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
mins =0;
secs =0;
team1 =[];
team2 =[];
input = { data: [] };
ainput = { data: [] };
  constructor(public alertController: AlertController,public game2:Match2Service, private zone: NgZone, public renderer: Renderer2) { 
this.team1 =[];
this.team2=[];

    console.log("Match = ",this.game2.currentmatch)

    // firebase.firestore().collection('Teams').doc(this.game2.currentmatch.TeamObject.uid).collection('Players').get().then(val => {
    //   this.team1 = [];
    //   val.forEach(res => {
        
  
    //     this.team1.push(res.data())
    //     console.log("24 = ", this.team1)
    //     this.input.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
    //   })
    //   console.log("players = ", this.input.data)
    // })
  
  
    // firebase.firestore().collection('Teams').doc(this.game2.currentmatch.aTeamObject.uid).collection('Players').get().then(val => {
    //   this.team2 = [];
    //   val.forEach(res => {
    //     this.team2.push(res.data())
    //     console.log("35 = ", this.team2)
  
    //     this.ainput.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
    //   })
  
    //   console.log("Aplayers = ", this.ainput.data)
    // })
  
  }

  ngOnInit() {
  }




firsthalf()
{

 
  console.log("first half")
  this.game2.firsthalf()



  
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

viewPlayer(state, side, playerData) {
  console.log("player obj", playerData)

  // state check if we are opening or closing the player details div
  switch (state) {
    case 'open':
      
      // if open, check for which side
      if (side == "home") {
        this.viewTeam('close', 'home', null)
        this.viewingPlayer.home = true;
        this.renderer.setStyle(this.homePlayerDiv[0], 'display', 'block')
        this.player.home = playerData
      } else {
        
        this.viewTeam('close', 'away', null)
        this.viewingPlayer.away = true;
        this.renderer.setStyle(this.awayPlayerDiv[0], 'display', 'block')
        this.player.away = playerData
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
        this.viewPlayer('close', 'home', null);
      } else {
        this.viewPlayer('close', 'away', null);
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
matchAction(state, side) {
  console.log('match action',state,side);
  
  // check the state of the action, are we opening or closing the panel
  switch (state) {
    case 'open':
      // check for which side the action is done
      if (side == 'home') {
        this.matchActionState.home = true
        this.renderer.setStyle(this.homePlayerActions[0], 'display', 'block')
        console.log(this.homePlayerActions[0]);
        
      } else {
        this.matchActionState.away = true
        this.renderer.setStyle(this.awayPlayerActions[0], 'display', 'block')
        console.log(this.awayPlayerActions[0]);
        
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

async goal1()
{
  console.log("goal1");

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


        
          firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(val => {
            console.log(val.data())
            let obj = val.data();
            obj.score = parseFloat(obj.score) + 1;
            this.game2.currentmatch.score = obj.score;

            firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ score:obj.score, mins: this.game2.mins, secs: this.game2.secs });

            firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
              goal: firebase.firestore.FieldValue.arrayUnion({
                scoretime: this.game2.mins.toString() +
                  ":" + this.game2.secs.toString(), goalscorer: data
              })
            })
          })
        }
      }
    ]
  });
  await alert.present();
}


async goal2()
{
  console.log("goal2");

  const alert = await this.alertController.create({
    header: 'Home',
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


        
          firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(val => {
            console.log(val.data())
            let obj = val.data();
            obj.ascore = parseFloat(obj.ascore) + 1;
            this.game2.currentmatch.ascore = obj.ascore;

            firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ ascore: obj.ascore, mins: this.game2.mins, secs: this.game2.secs});

            firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
              agoal: firebase.firestore.FieldValue.arrayUnion({
                scoretime: this.game2.mins.toString() +
                  ":" + this.game2.secs.toString(), goalscorer: data
              })
            })
          })
        }
      }
    ]
  });
  await alert.present();
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
             
              firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                stats: firebase.firestore.FieldValue.arrayUnion({
                  yellow: this.mins.toString() +
                    ":" + this.secs.toString(), playerName: data
                })
              })
        

              


              firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
              


                let obj:any = {...{fixtureid:res.id},...res.data()};
                obj.yellow = obj.yellow + 1;
                console.log("Object yellow = ", obj.yellow)

                this.game2.currentmatch =obj;
                firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ yellow: obj.yellow });

              })


            }

            else
              if (x == "red") {
           

            
                
              



                firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                  res.data();
                  let obj:any = {...{fixtureid:res.id},...res.data()};
                  obj.red = res.data().red + 1;
                  this.game2.currentmatch =obj;
                  

                  console.log("Object red = ", obj.red)

                  firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ red: obj.red });

                })
                firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                  stats: firebase.firestore.FieldValue.arrayUnion({
                    red: this.mins.toString() +
                      ":" + this.secs.toString(), playerName: data
                  })
                })
              }

              else
                if (x == "offsides") {

                  firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                  
                    let obj:any = {...{fixtureid:res.id},...res.data()};
                    obj.offsides = res.data().offsides + 1;
                    this.game2.currentmatch =obj;
                    firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ offsides: obj.offsides });
                  })

                  firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                    stats: firebase.firestore.FieldValue.arrayUnion({
                      offsides: this.mins.toString() +
                        ":" + this.secs.toString(), playerName: data
                    })
                  })
                }


                else
                  if (x == "corners") {
                  
                    firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                      stats: firebase.firestore.FieldValue.arrayUnion({
                        corners: this.mins.toString() +
                          ":" + this.secs.toString(), playerName: data
                      })
                    })


                    firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                      res.data();
                      let obj:any = {...{fixtureid:res.id},...res.data()};
                      obj.corners = res.data().corners + 1;
                      this.game2.currentmatch =obj;

                   
                      firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ corners: obj.corners });
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
           


              firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                stats: firebase.firestore.FieldValue.arrayUnion({
                  ayellow: this.mins.toString() +
                    ":" + this.secs.toString(), playerName: data
                })
              })
              console.log("yellow")

              


              firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                res.data();
                let obj:any = {...{fixtureid:res.id},...res.data()};
                obj.ayellow = obj.ayellow + 1;
console.log(obj.ayellow)
                this.game2.currentmatch =obj;
                firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ ayellow: obj.ayellow });

              })


            }

            else
              if (x == "red") {
             
                console.log("red")

                firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                  
                  let obj:any = {...{fixtureid:res.id},...res.data()};
                  obj.ared = parseFloat(obj.ared) + 1;
                  this.game2.currentmatch =obj;
console.log("Away Red", obj.ared)

                  firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ ared: obj.ared });

                })
                firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                  stats: firebase.firestore.FieldValue.arrayUnion({
                    ared: this.mins.toString() +
                      ":" + this.secs.toString(), playerName: data
                  })
                })
              }

              else
                if (x == "offsides") {



                  firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                    res.data();
                    let obj:any = {...{fixtureid:res.id},...res.data()};
                    obj.aoffsides = res.data().aoffsides + 1;
                    this.game2.currentmatch =obj;
                    firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ aoffsides: obj.aoffsides });
                  })

                  firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                    stats: firebase.firestore.FieldValue.arrayUnion({
                      aoffsides: this.mins.toString() +
                        ":" + this.secs.toString(), playerName: data
                    })
                  })
                }


                else
                  if (x == "corners") {
                 
                    firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({
                      stats: firebase.firestore.FieldValue.arrayUnion({
                        acorners: this.mins.toString() +
                          ":" + this.secs.toString(), playerName: data
                      })
                    })


                    firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).get().then(res => {
                      res.data();
                      let obj:any = {...{fixtureid:res.id},...res.data()};
                      obj.acorners = res.data().acorners + 1;
                      this.game2.currentmatch =obj;
                     
                      firebase.firestore().collection('MatchFixtures').doc(this.game2.currentmatch.fixtureid).update({ acorners: obj.acorners });
                    })
                  }








          }
        }
      ]
    });
    await alert.present();
  }
}
















}
