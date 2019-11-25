import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllserveService {
q1:any =[];
q2:any =[];
fixture:any =[];
  constructor() { }


  randomfixture(q1,q2)
{
  this.fixture =[];
  this.q1 =q1;
  this.q2 =q2;
console.log(this.q1,this.q2)


for(let v = 0;v<this.q1.length;v++)
{
  console.log(v)


let away:any ={
aManager:this.q2[v].Manager,
aTeamName:this.q2[v].TeamName,
Tournament:this.q2[v].Tournament,
awhr:this.q2[v].whr
}

console.log("away object = ",away)
console.log({...this.q1[v],...away})
this.fixture.push({...this.q1[v],...away});
}

}

  
}





