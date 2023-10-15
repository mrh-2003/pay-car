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

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'run', component: SmartCreditComponent},
      {path: 'bank/edit/:id', component: AddEditBankComponent},
      {path: 'bank/add', component: AddEditBankComponent},
      {path: 'bank', component: ListBankComponent},
      {path: 'history', component: HistoryComponent},
    ],
  },
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
