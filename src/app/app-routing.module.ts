import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SmartCreditComponent } from './components/smart-credit/smart-credit.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: DashboardComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'run', component: SmartCreditComponent},
    ]
  },
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
