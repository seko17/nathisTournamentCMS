import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';

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
  // ___________________________________________
// BEGGIN BACKEND HERE

  tempCardGen = [] // temporary card generator, used for ngFor
  constructor(public zone: NgZone, public renderer: Renderer2) { }

  ngOnInit() {
    while (this.tempCardGen.length < 40) {
      this.tempCardGen.push('card')

    }
  }
  viewmatch(state, item) {
    console.log('do something with the item', item);

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
          console.log('home team open');
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
      if (side=='home') {
        this.matchActionState.home = true
        this.renderer.setStyle(this.homePlayerActions[0], 'display', 'block')
      } else {
        this.matchActionState.away = true
        this.renderer.setStyle(this.awayPlayerActions[0], 'display', 'block')
      }
        break;
      case 'close':
        if (side=='home') {
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
}