import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule} from '@angular/fire/compat';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './modules/shared/shared.module';
import { ListBankComponent } from './components/list-bank/list-bank.component';
import { AddEditBankComponent } from './components/add-edit-bank/add-edit-bank.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeComponent } from './components/home/home.component';
import { SmartCreditComponent } from './components/smart-credit/smart-credit.component';
import { HistoryComponent } from './components/history/history.component';
import { ListRunComponent } from './components/list-run/list-run.component';
import { CloseDialogComponent } from './components/close-dialog/close-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { OptionsDialogComponent } from './components/options-dialog/options-dialog.component';
import { PriceDialogComponent } from './components/price-dialog/price-dialog.component';
import { ListCarComponent } from './components/list-car/list-car.component';
import { AddEditCarComponent } from './components/add-edit-car/add-edit-car.component';
import { CompareBanksComponent } from './components/compare-banks/compare-banks.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListBankComponent,
    AddEditBankComponent,
    DashboardComponent,
    HomeComponent,
    SmartCreditComponent,
    HistoryComponent,
    ListRunComponent,
    CloseDialogComponent,
    DeleteDialogComponent,
    ConfirmDialogComponent,
    OptionsDialogComponent,
    PriceDialogComponent,
    ListCarComponent,
    AddEditCarComponent,
    CompareBanksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    SharedModule,
    LayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
