import * as firebase from 'firebase';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/services/user/auth.service';
import { Router } from '@angular/router';
import { UserCredential } from 'src/app/model/user';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent) loginForm: AuthFormComponent;
  user = firebase.auth().currentUser;
  profileForm: FormGroup;
  db = firebase.firestore()
  storage = firebase.storage().ref();
  profile = {
    image: null,
    formInfo: null
  }
  uploadProgress = 0
  imageState = 'upload';
  profileState = false
  setUpProfileDiv = document.getElementsByClassName('setUpProfile')
  creatingProfile = false
  loginLoader
  constructor(private authService: AuthService,
     public renderer: Renderer2, 
     private router: Router, 
     public navCtrl: NavController, 
     public formBuilder: FormBuilder, 
     public alertCtrl: AlertController,
     public loadingCtrl: LoadingController,
     public location : Location) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength((4))]],
      number: ['', [Validators.required, Validators.minLength((10)), Validators.maxLength((10))]]
    })
  }
  createProfile(data) {
    this.creatingProfile= true
    this.profile.formInfo = data
    this.db.collection('CMS_Profile').doc(firebase.auth().currentUser.uid).set(this.profile).then(res => {
      this.creatingProfile= false
      this.profilePresent('close')
      this.profileForm.reset()
      this.navCtrl.navigateRoot('home')
    }).catch(async err => {
      let alerter = await this.alertCtrl.create({
        header: 'ERROR',
        message: err.message,
        buttons: [{text: 'Okay',role:'cancel'}]
      })
      this.creatingProfile= false
      this.uploadProgress = 0
    })
  }
  deleteImage() { this.profile.image = null }

  async updatePassword() {
    let alerter = await this.alertCtrl.create({
      header: 'Password Reset',
      message: "Enter your email in order for us to send you the password reset link",
      inputs: [{
        placeholder: 'example@mail.com',
        type: 'email',
        name: 'email'
      }],
      buttons: [{
        text: 'Change',
        handler: (data) => {
          
         this.authService.resetPassword(data.email).then( async res => {
          let alerter = await this.alertCtrl.create({
            header: 'Password Reset',
            message: "Please check you inbox for the reset link.",
            buttons: [ {
              text: 'Okay',
              role: 'cancel'
            }]
          })
          alerter.present()
         }).catch(async err => {
          console.log('pass res err', err);
          let alerter = await this.alertCtrl.create({
            header: 'Reset Error',
            message: err.message,
            buttons: [{
              text: 'Okay',
              role: 'cancel'
            }]
          })
          alerter.present()
         })
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })
    alerter.present()
  }
  async loginUser(credentials: UserCredential): Promise<void> {
    this.loginLoader = await this.loadingCtrl.create({
      message: 'Please Wait',
      spinner: 'lines'
    })
    this.loginLoader.present()
    try {
      
      const userCredential: firebase.auth.UserCredential = await this.authService.loginUser(
        credentials.email,
        credentials.password
      );
      this.authService.userId = userCredential.user.uid;
      
      this.db.collection('CMS_Profiles').doc(firebase.auth().currentUser.uid).get().then(async res => {
        console.log('login res', res);
        
        if (res.exists) {
          await this.loginLoader.dismiss()
          this.location.back()
          setTimeout(() => {
            this.navCtrl.navigateRoot('home')
          }, 500);
          console.log('exists');
          await this.loginForm.hideLoading();
          
        } else {
          await this.loginLoader.dismiss()
          this.profilePresent('open')
          await this.loginForm.hideLoading();
        }
      })
    } catch (error) {
      await this.loginLoader.dismiss()
      console.log('auth form error', error);

      this.loginForm.handleError(error);
    }
  }
  async selectimage(image) {

    console.log(image.name)
    let imagetosend = image.item(0);
    console.log(imagetosend);

    if (!imagetosend) {
      const imgalert = await this.alertCtrl.create({
        message: 'Select image to upload',
        buttons: [{
          text: 'Okay',
          role: 'cancel'
        }]
      });
      imgalert.present();
    } else {
      if (imagetosend.type.split('/')[0] !== 'image') {
        const imgalert = await this.alertCtrl.create({
          message: 'Unsupported file type.',
          buttons: [{
            text: 'Okay',
            role: 'cancel'
          }]
        });
        imgalert.present();
        imagetosend = '';
        return;
      } else {
        const upload = this.storage.child(image.item(0).name).put(imagetosend);
        upload.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = progress
          console.log(progress);

          if (progress > 0) {
            this.imageState = 'uploading'
          }
        }, error => {
        }, () => {
          upload.snapshot.ref.getDownloadURL().then(downUrl => {
            this.profile.image = downUrl;
            this.uploadProgress = 0;
          });
        });
      }
    }
  }
  profilePresent(state) {
    switch (state) {
      case 'open':
setTimeout(() => {
  this.profileState = true
  this.renderer.setStyle(this.setUpProfileDiv[0],'display','flex')
}, 500);
        break;
      case 'close':
        this.profileState = false
        setTimeout(() => {
          this.renderer.setStyle(this.setUpProfileDiv[0],'display','none')
        }, 500);
        break;
    }
  }
}
