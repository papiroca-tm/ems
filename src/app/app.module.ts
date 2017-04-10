import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MediaDataBaseComponent } from './mediaDataBase/mediaDataBase.component';
import { PageNotFoundComponent } from './pageNotFound/pageNotFound.component';

import {
  ToolbarModule,
  SplitButtonModule, 
  ButtonModule } from 'primeng/primeng';

import { AppComponent } from './app.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    // import primeng modules
    ToolbarModule,
    SplitButtonModule,
    ButtonModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    MediaDataBaseComponent,
    PageNotFoundComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
