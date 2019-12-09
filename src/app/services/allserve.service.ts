import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllserveService {
q1:any =[];
q2:any =[];
currentmatch:any ={};
fixture:any =[];
tournaments =[];
  constructor() { }


  randomfixture(q1,q2)
{
  this.fixture =[];
 



for(let v = 0;v<q1.length;v++)
{
  console.log(v)


let away:any ={
aTeamObject:q2[v].TeamObject,
awhr:q2[v].whr
}


this.fixture.push({...q1[v],...away});

console.log("Fixture variable = ",this.fixture)
}

}

  
}





