import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.page.html',
  styleUrls: ['./manage-members.page.scss'],
})
export class ManageMembersPage implements OnInit {
  // CSS Properties __________________________________
    // dummy array to test css overflow-x or -y
    tempCardGen = []
    // _______________________________________________
  constructor() { }

  ngOnInit() {
    while (this.tempCardGen.length < 20) {
      let int = 0
      let counter = int + 1;
      this.tempCardGen.push('card', counter)
    }
  }

}
