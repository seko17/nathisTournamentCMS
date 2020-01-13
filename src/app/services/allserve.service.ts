import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllserveService {
q1:any =[];
q2:any =[];
currentmatch:any ={};
fixture:any =[];
dropfixture =[];
tournaments =[];
tournid;
blocker =true;
firsthalf =false;
secondhalf =false;
  constructor() { }

firstdoc ={};

dragdropfixture(fixture)
{
this.fixture =[];
this.dropfixture  =fixture;




return this.dropfixture ;

}


  randomfixture(q1,q2)
{
  




for(let v = 0;v<q1.length;v++)
{
  console.log(q2[v].whr)


let away:any ={
aTeamObject:q2[v].TeamObject,
awhr:q2[v].whr
}

console.log("away = ",away)

this.fixture.push({...q1[v],...away,...{matchstate:'incomplete'}});

console.log("Fixture variable = ",this.fixture)
}

}

  
}





