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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListBankComponent,
    AddEditBankComponent,
    DashboardComponent,
    HomeComponent,
    SmartCreditComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    SharedModule,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
