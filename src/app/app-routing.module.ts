import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SmartCreditComponent } from './components/smart-credit/smart-credit.component';
import { ListBankComponent } from './components/list-bank/list-bank.component';
import { AddEditBankComponent } from './components/add-edit-bank/add-edit-bank.component';
import { HistoryComponent } from './components/history/history.component';
import { AuthGuard } from './guards/auth.guard';
import { ListRunComponent } from './components/list-run/list-run.component';
import { LoginGuard } from './guards/login.guard';
import { ListCarComponent } from './components/list-car/list-car.component';
import { AddEditCarComponent } from './components/add-edit-car/add-edit-car.component';
import { CompareBanksComponent } from './components/compare-banks/compare-banks.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate:[LoginGuard] },
  {path: 'a', redirectTo: 'home', pathMatch: 'full'},
  {path: 'a', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'run', component: SmartCreditComponent},
      {path: 'run/:id', component: SmartCreditComponent},
      {path: 'run/car/:idCar', component: SmartCreditComponent},
      {path: 'bank/edit/:id', component: AddEditBankComponent},
      {path: 'bank/add', component: AddEditBankComponent},
      {path: 'bank', component: ListBankComponent},
      {path: 'cars', component: ListCarComponent},
      {path: 'car/add', component: AddEditCarComponent},
      {path: 'car/edit/:id', component: AddEditCarComponent},
      {path: 'bank/compare', component: CompareBanksComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'show-run/:id', component: ListRunComponent},
    ],
  },
  {path: 'a', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LoginGuard]
})
export class AppRoutingModule { }
