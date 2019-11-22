import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule], declarations: [AuthFormComponent], exports: [AuthFormComponent], entryComponents: [AuthFormComponent] 
})
export class AuthModule { }
