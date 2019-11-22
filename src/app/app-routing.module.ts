import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]},
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./pages/landing-page/landing-page.module').then( m => m.LandingPagePageModule, )
  },
  {
    path: 'create-profile',
    loadChildren: () => import('./pages/create-profile/create-profile.module').then( m => m.CreateProfilePageModule)
  },  {
    path: 'setfixtures',
    loadChildren: () => import('./pages/setfixtures/setfixtures.module').then( m => m.SetfixturesPageModule)
  },
  {
    path: 'fixtures',
    loadChildren: () => import('./pages/fixtures/fixtures.module').then( m => m.FixturesPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
