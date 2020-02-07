import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private storage:Storage, private route:Router,public alertController: AlertController) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log(route);

    let authInfo = {
      authenticated: false
    };

    if (!authInfo.authenticated) {
      this.presentAlert();
      this.route.navigate(["login"]);
      return false;
    }

    return true;
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Unauthorized',
      message: 'You are not authorized to visit that page!',
      buttons: ['OK']
    });

    await alert.present();
  }
}
