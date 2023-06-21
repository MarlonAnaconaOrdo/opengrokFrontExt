import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast'
import { MessageService } from 'primeng/api';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { MethodComponentComponent } from './components/method-component/method-component.component';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MethodComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastModule,
OAuthModule.forRoot(),
HttpClientModule,
BrowserAnimationsModule,
CardModule,

],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
