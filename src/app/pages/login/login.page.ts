import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/services/user/auth.service';
import { Router } from '@angular/router';
import { UserCredential } from 'src/app/model/user';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent, { static: false }) loginForm: AuthFormComponent;
  constructor(private authService: AuthService, private router: Router, public navCtrl: NavController) {}

  ngOnInit() {}

  async loginUser(credentials: UserCredential): Promise<void> {
    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.loginUser(
        credentials.email,
        credentials.password
      );
      this.authService.userId = userCredential.user.uid;
      await this.loginForm.hideLoading();
      this.navCtrl.navigateRoot('home')
    } catch (error) {
      await this.loginForm.hideLoading();
      this.loginForm.handleError(error);
    }
  }
}
