import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private navc: NavController) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          // resolve(true);
          console.log('User is logged in');
          // this.router.navigate(['/home']);
          this.navc.navigateRoot('home')
          return true;
        } else {
          console.log('User is not logged in');
          this.navc.navigateRoot('login')
          // this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
