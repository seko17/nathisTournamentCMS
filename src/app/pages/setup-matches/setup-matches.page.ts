import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setup-matches',
  templateUrl: './setup-matches.page.html',
  styleUrls: ['./setup-matches.page.scss'],
})
export class SetupMatchesPage implements OnInit {
  // CS Properties ______________________________
  tempCardGen = []
  // ____________________________________________
  constructor() { }

  ngOnInit() {
    while (this.tempCardGen.length < 40) {
      this.tempCardGen.push('card')
    }
  }

}
