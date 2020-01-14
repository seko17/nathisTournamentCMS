import { Component, OnInit } from '@angular/core';
import {Match2Service} from '../../services/match2.service';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-match2wo',
  templateUrl: './match2wo.page.html',
  styleUrls: ['./match2wo.page.scss'],
})
export class Match2woPage implements OnInit {
mins =0;
secs =0;
team1 =[];
team2 =[];
input = { data: [] };
ainput = { data: [] };
  constructor(public alertController: AlertController,public game2:Match2Service) { 
this.team1 =[];
this.team2=[];

    console.log("Match = ",this.game2.currentmatch)

    firebase.firestore().collection('Teams').doc(this.game2.currentmatch.TeamObject.uid).collection('Players').get().then(val => {
      this.team1 = [];
      val.forEach(res => {
        
  
        this.team1.push(res.data())
        console.log("24 = ", this.team1)
        this.input.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
      })
      console.log("players = ", this.input.data)
    })
  
  
    firebase.firestore().collection('Teams').doc(this.game2.currentmatch.aTeamObject.uid).collection('Players').get().then(val => {
      this.team2 = [];
      val.forEach(res => {
        this.team2.push(res.data())
        console.log("35 = ", this.team2)
  
        this.ainput.data.push({ name: "radio", type: 'radio', label: res.data().fullName, value: res.data().fullName })
      })
  
      console.log("Aplayers = ", this.ainput.data)
    })
  
  }

  ngOnInit() {
  }




firsthalf()
{
  this.game2.firsthalf()



  
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
