import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full',canActivate: [AuthGuard] },
  // , canActivate: [AuthGuard]
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'setfixtures',
    loadChildren: () => import('./pages/setfixtures/setfixtures.module').then( m => m.SetfixturesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./pages/landing-page/landing-page.module').then( m => m.LandingPagePageModule, )
  },
  {
    path: 'create-profile',
    loadChildren: () => import('./pages/create-profile/create-profile.module').then( m => m.CreateProfilePageModule)
  },
 
  {
    path: 'fixtures',
    loadChildren: () => import('./pages/fixtures/fixtures.module').then( m => m.FixturesPageModule)
  },
  {
    // Current Tournament Page
    path: 'currtourn',
    loadChildren: () => import('./pages/currtourn/currtourn.module').then( m => m.CurrtournPageModule)
  },
  {
    path: 'currentmatch',
    loadChildren: () => import('./pages/currentmatch/currentmatch.module').then( m => m.CurrentmatchPageModule)
  },
  {
    path: 'manage-tournaments',
    loadChildren: () => import('./pages/manage-tournaments/manage-tournaments.module').then( m => m.ManageTournamentsPageModule)
  },
  {
    path: 'setup-matches',
    loadChildren: () => import('./pages/setup-matches/setup-matches.module').then( m => m.SetupMatchesPageModule)
  },
  {
    path: 'setfixture',
    loadChildren: () => import('./setfixture/setfixture.module').then( m => m.SetfixturePageModule)
  },
  {
    path: 'manage-members',
    loadChildren: () => import('./pages/manage-members/manage-members.module').then( m => m.ManageMembersPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'dragdrop',
    loadChildren: () => import('./pages/dragdrop/dragdrop.module').then( m => m.DragdropPageModule)
  },
  {
    path: 'match2wo',
    loadChildren: () => import('./pages/match2wo/match2wo.module').then( m => m.Match2woPageModule)
  },




];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
