import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subscription, Observable, observable,timer } from 'rxjs';
import { LoadingController, IonicModule, Platform, AlertController } from '@ionic/angular';
import { AllserveService } from 'src/app/services/allserve.service';
import { getOverlays } from '@ionic/core/dist/types/utils/overlays';
@Component({
  selector: 'app-currentmatch',
  templateUrl: './currentmatch.page.html',
  styleUrls: ['./currentmatch.page.scss'],
})
export class CurrentmatchPage implements OnInit {
currentmatch =[];
timer;
docid;
mins:number =0;
sub :Subscription;
btntxt1 ="First Half";
btntxt2 ="Second Half";
btn1 =false;
btn2 =true;
  constructor(public alertController: AlertController,public plt:Platform,public serve:AllserveService,public router:Router) {

    this.matchstats =[];
    



    firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{


      console.log(this.currentmatch)
    this.score =val.data().score;
    this.ascore =val.data().ascore;
    this.tourname =val.data().Tournament;
      if(val.data().mins>0&&val.data().mins<=46)
      {
       this.btntxt1 ="Resume First Half";
       this.btn1 =false;
       this.btn2 =true;
      }
      else  if(val.data().mins>45&&val.data().mins<=90)
      {
        this.btn1 =true;
        this.btn2 =false;
        this.btntxt2 ="Resume Second Half";
      }


      firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
      
        val.forEach(res=>{
       
         this.id =res.id;
          this.matchstats.push(res.data());
     
    
        })
        
                })
              
              
         })
      
      

   }

  ngOnInit() {

  }
  input={data:[]};
  ainput={data:[]};
ionViewWillEnter()
{
  this.input={data:[]};
  this.currentmatch.push(this.serve.currentmatch);
  console.log("currentmatch = ",this.currentmatch);

  firebase.firestore().collection('Players').where("TeamName","==", this.currentmatch[0].TeamName).get().then(val=>{
    
    val.forEach(res=>{
      console.log( res.data())
      this.input.data.push({name:"radio",type: 'radio',label:res.data().name,value:res.data().name})
  
    })
    
  })



  firebase.firestore().collection('Players').where("TeamName","==", this.currentmatch[0].aTeamName).get().then(val=>{
    
    val.forEach(res=>{
      console.log( res.data())
      this.ainput.data.push({name:"radio",type: 'radio',label:res.data().name,value:res.data().name})
  
    })
    
  })
}




firsthalf()
{
  this.btn1 =true;
  this.btn2 =true;
  
    this.sub = timer(0,1000).subscribe(result =>{
     


console.log('docid = ',this.serve.currentmatch.id)

      firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{

    
this.timer =val.data().timer;
        console.log(val.data().timer)
        this.mins=val.data().mins   
        if(this.timer==59)
        {
this.timer =0;
this.mins=this.mins+1;

        }


 firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({timer:this.timer+1,mins:this.mins});
      })
  
  
  
    })









   



}

async stop()
{

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
          this.btn1 =true;
          this.btn2 =false;
          this.sub.unsubscribe();
          console.log(this.sub.unsubscribe())
        }
      }
    ]
  });

  await alert.present();






 
}

secondhalf()
{
  this.btn1 =true;
  this.btn2 =true;
  this.sub = timer(0,1000).subscribe(result =>{
     


    console.log('docid = ',this.serve.currentmatch.id)
    
          firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).get().then(val=>{
    
    this.timer =val.data().timer;
            console.log(val.data().timer)
            
            if(this.timer==59)
            {
    this.timer =0;
    this.mins=this.mins+1;
    
            }
    
    
            firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({timer:this.timer+1,mins:this.mins});
          })
      
      
      
        })
    
    
    
    
    



}



async ionViewWillLeave()
{
  const alert = await this.alertController.create({
    header: 'Alert',
    subHeader: 'Warning!',
    message: 'Leaving this page during a match will pause any ongoing matches!',
    buttons: ['OK']
  });

  await alert.present();
  this.sub.unsubscribe();
}

score;
ascore;
tourname;
id;
matchstats =[];
goals =[];
 async goal1()
{
  this.currentmatch =[];
console.log("click",this.tourname);

this.goals =[];

   

const alert = await this.alertController.create({
  header: 'Home',
  subHeader:'Pick Goal scorer',
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



        firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
          val.forEach(res=>{
            console.log( res.data())
            let obj = res.data();
            obj.score =parseFloat(obj.score)+1;
            this.score =obj.score;
      
            console.log(obj.goal)
            console.log(obj.score)

            this.goals =obj.goal;
            console.log(this.goals)
            this.currentmatch.push(obj);
            this.id =res.id;
            
           

            firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({score:this.score+1});    


firebase.firestore().collection('Top4').doc(this.id).update({goal: firebase.firestore.FieldValue.arrayUnion({scoretime:this.mins.toString()+
":"+this.timer.toString(),goalscorer:data })})
// ({goal:[{scoretime:this.mins.toString()+this.timer.toString(),goalscorer:data }]}, { merge: true });
      
          })
          
      })
    

      }
    }
  ]
});
await alert.present();






  

           
    

      
}

agoals;
async goal2()
{
  this.currentmatch =[];
console.log("click",this.tourname);

this.agoals =[];

   

const alert = await this.alertController.create({
  header: 'Away',
  subHeader:'Pick Goal scorer',
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



        firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
          val.forEach(res=>{
            console.log( res.data())
            let obj = res.data();
            obj.ascore =parseFloat(obj.ascore)+1;
            this.ascore =obj.ascore;
      
            console.log(obj.agoal)
            console.log(obj.ascore)

            this.agoals =obj.agoal;
            console.log(this.agoals)
            this.currentmatch.push(obj);
            this.id =res.id;
            
           

            firebase.firestore().collection('MatchFixtures').doc(this.serve.currentmatch.id).update({ascore:this.ascore+1});    


firebase.firestore().collection('Top4').doc(this.id).update({agoal: firebase.firestore.FieldValue.arrayUnion({scoretime:this.mins.toString()+
":"+this.timer.toString(),goalscorer:data })})
// ({goal:[{scoretime:this.mins.toString()+this.timer.toString(),goalscorer:data }]}, { merge: true });
      
          })
          
      })
    

      }
    }
  ]
});
await alert.present();





}



async homestats(x)
{
  // console.log(x)


  
    let input={data:[]};

      input.data.push({name:"radio",type: 'radio',label:"Shots",value:"shots"})
      input.data.push({name:"radio",type: 'radio',label:"On Target",value:"ontarget"})
      input.data.push({name:"radio",type: 'radio',label:"Foul",value:"fouls"})
      input.data.push({name:"radio",type: 'radio',label:"Yellow Card",value:"yellow"})
      input.data.push({name:"radio",type: 'radio',label:"Red Card",value:"red"})
      input.data.push({name:"radio",type: 'radio',label:"Off Side",value:"offsides"})
      input.data.push({name:"radio",type: 'radio',label:"Corner",value:"corners"})

      

   
    console.log(input);
    const alert = await this.alertController.create({
      header: 'Home',
      subHeader:'Pick event',
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



if(data =="shots")
{
  this.matchstats =[];
          firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
            val.forEach(res=>{
                let val =res.data().shots;
               let obj =res.data();
               obj.shots =obj.shots+1;
                
                this.matchstats.push(obj);
                this.id =res.id;
                console.log( this.id)
                firebase.firestore().collection('Top4').doc(this.id).update({shots:val+1});
          
              })
              
                      })
               


                    }

  else

  if(data =="ontarget")
{
  this.matchstats =[];
          firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
            val.forEach(res=>{
                let val =res.data().ontarget;
               let obj =res.data();
               obj.ontarget =obj.ontarget+1;
                
                this.matchstats.push(obj);
                this.id =res.id;
                console.log( this.id)
                firebase.firestore().collection('Top4').doc(this.id).update({ontarget:val+1});
          
              })
              
                      })


                    }
                    else
                    if(data =="fouls")
                    {
                      this.matchstats =[];
                              firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                        
                                val.forEach(res=>{
                                    let val =res.data().fouls;
                                   let obj =res.data();
                                   obj.fouls =obj.fouls+1;
                                    
                                    this.matchstats.push(obj);
                                    this.id =res.id;
                                    console.log( this.id)
                                    firebase.firestore().collection('Top4').doc(this.id).update({fouls:val+1});
                              
                                  })
                                  
                                          })


                                          
                    
                    
                                        }
                                        else
                                        if(data =="yellow")
                                        {
                                          this.matchstats =[];
                                                  firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                            
                                                    val.forEach(res=>{
                                                        let val =res.data().yellow;
                                                       let obj =res.data();
                                                       obj.yellow =obj.yellow+1;
                                                        
                                                        this.matchstats.push(obj);
                                                        this.id =res.id;
                                                        console.log( this.id)
                                                        firebase.firestore().collection('Top4').doc(this.id).update({yellow:val+1});
                                                  
                                                      })
                                                      
                                                              })

                                                            }

                                                            else
                                                            if(data =="red")
                                                            {
                                                              this.matchstats =[];
                                                                      firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                                                
                                                                        val.forEach(res=>{
                                                                            let val =res.data().red;
                                                                           let obj =res.data();
                                                                           obj.red =obj.red+1;
                                                                            
                                                                            this.matchstats.push(obj);
                                                                            this.id =res.id;
                                                                            console.log( this.id)
                                                                            firebase.firestore().collection('Top4').doc(this.id).update({red:val+1});
                                                                      
                                                                          })
                                                                          
                                                                                  })
                                                                                }

                                                                                  else
                                                                                  if(data =="offsides")
                                                                                  {
                                                                                    this.matchstats =[];
                                                                                            firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                                                                      
                                                                                              val.forEach(res=>{
                                                                                                  let val =res.data().off;
                                                                                                 let obj =res.data();
                                                                                                 obj.off =obj.off+1;
                                                                                                  
                                                                                                  this.matchstats.push(obj);
                                                                                                  this.id =res.id;
                                                                                                  console.log( obj.shots)
                                                                                                  firebase.firestore().collection('Top4').doc(this.id).update({off:val+1});
                                                                                            
                                                                                                })
                                                                                                
                                                                                                        })
                                                                                                      }


                                                                                                      else
                                                                                                      if(data =="corners")
                                                                                                      {
                                                                                                        this.matchstats =[];
                                                                                                                firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                                                                                          
                                                                                                                  val.forEach(res=>{
                                                                                                                      let val =res.data().corner;
                                                                                                                     let obj =res.data();
                                                                                                                     obj.corner = obj.corner+1;
                                                                                                                      
                                                                                                                      this.matchstats.push(obj);
                                                                                                                      this.id =res.id;
                                                                                                                      console.log( this.id)
                                                                                                                      firebase.firestore().collection('Top4').doc(this.id).update({corner:val+1});
                                                                                                                
                                                                                                                    })
                                                                                                                    
                                                                                                                            })

                                                                                                                          }








          }
        }
      ]
    });
    await alert.present();
  
}







async awaystats(x)
{
  // console.log(x)


  
    let input={data:[]};

      input.data.push({name:"radio",type: 'radio',label:"Shots",value:"ashots"})
      input.data.push({name:"radio",type: 'radio',label:"On Target",value:"aontarget"})
      input.data.push({name:"radio",type: 'radio',label:"Foul",value:"afouls"})
      input.data.push({name:"radio",type: 'radio',label:"Yellow Card",value:"ayellow"})
      input.data.push({name:"radio",type: 'radio',label:"Red Card",value:"ared"})
      input.data.push({name:"radio",type: 'radio',label:"Off Side",value:"aoffsides"})
      input.data.push({name:"radio",type: 'radio',label:"Corner",value:"acorners"})

      

   
    console.log(input);
    const alert = await this.alertController.create({
      header: 'Away',
      subHeader:'Pick event',
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



if(data =="ashots")
{
  this.matchstats =[];
          firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
            val.forEach(res=>{
                let val =res.data().ashots;
               let obj =res.data();
               obj.ashots =obj.ashots+1;
                
                this.matchstats.push(obj);
                this.id =res.id;
                console.log( this.id)
                firebase.firestore().collection('Top4').doc(this.id).update({ashots:val+1});
          
              })
              
                      })
               


                    }

  else

  if(data =="aontarget")
{
  this.matchstats =[];
          firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
    
            val.forEach(res=>{
                let val =res.data().aontarget;
               let obj =res.data();
               obj.aontarget =obj.aontarget+1;
                
                this.matchstats.push(obj);
                this.id =res.id;
                console.log( this.id)
                firebase.firestore().collection('Top4').doc(this.id).update({aontarget:val+1});
          
              })
              
                      })


                    }
                    else
                    if(data =="afouls")
                    {
                      this.matchstats =[];
                              firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                        
                                val.forEach(res=>{
                                    let val =res.data().afouls;
                                   let obj =res.data();
                                   obj.afouls =obj.afouls+1;
                                    
                                    this.matchstats.push(obj);
                                    this.id =res.id;
                                    console.log( this.id)
                                    firebase.firestore().collection('Top4').doc(this.id).update({afouls:val+1});
                              
                                  })
                                  
                                          })


                                          
                    
                    
                                        }
                                        else
                                        if(data =="ayellow")
                                        {
                                          this.matchstats =[];
                                                  firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                            
                                                    val.forEach(res=>{
                                                        let val =res.data().ayellow;
                                                       let obj =res.data();
                                                       obj.ayellow =obj.ayellow+1;
                                                        
                                                        this.matchstats.push(obj);
                                                        this.id =res.id;
                                                        console.log( this.id)
                                                        firebase.firestore().collection('Top4').doc(this.id).update({ayellow:val+1});
                                                  
                                                      })
                                                      
                                                              })

                                                            }

                                                            else
                                                            if(data =="ared")
                                                            {
                                                              this.matchstats =[];
                                                                      firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                                                
                                                                        val.forEach(res=>{
                                                                            let val =res.data().ared;
                                                                           let obj =res.data();
                                                                           obj.ared =obj.ared+1;
                                                                            
                                                                            this.matchstats.push(obj);
                                                                            this.id =res.id;
                                                                            console.log( this.id)
                                                                            firebase.firestore().collection('Top4').doc(this.id).update({ared:val+1});
                                                                      
                                                                          })
                                                                          
                                                                                  })
                                                                                }

                                                                                  else
                                                                                  if(data =="aoffsides")
                                                                                  {
                                                                                    this.matchstats =[];
                                                                                            firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                                                                      
                                                                                              val.forEach(res=>{
                                                                                                  let val =res.data().aoff;
                                                                                                 let obj =res.data();
                                                                                                 obj.aoff =obj.aoff+1;
                                                                                                  
                                                                                                  this.matchstats.push(obj);
                                                                                                  this.id =res.id;
                                                                                                  console.log( obj.shots)
                                                                                                  firebase.firestore().collection('Top4').doc(this.id).update({aoff:val+1});
                                                                                            
                                                                                                })
                                                                                                
                                                                                                        })
                                                                                                      }


                                                                                                      else
                                                                                                      if(data =="acorners")
                                                                                                      {
                                                                                                        this.matchstats =[];
                                                                                                                firebase.firestore().collection('Top4').where("Tournament","==",this.tourname).get().then(val=>{
                                                                                                          
                                                                                                                  val.forEach(res=>{
                                                                                                                      let val =res.data().acorner;
                                                                                                                     let obj =res.data();
                                                                                                                     obj.acorner = obj.acorner+1;
                                                                                                                      
                                                                                                                      this.matchstats.push(obj);
                                                                                                                      this.id =res.id;
                                                                                                                      console.log( this.id)
                                                                                                                      firebase.firestore().collection('Top4').doc(this.id).update({acorner:val+1});
                                                                                                                
                                                                                                                    })
                                                                                                                    
                                                                                                                            })

                                                                                                                          }








          }
        }
      ]
    });
    await alert.present();
  
}
}









