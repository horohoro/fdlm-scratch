import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerSelectorComponent } from './player-selector/player-selector.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { ResultComponent } from './result/result.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddCardComponent } from './add-card/add-card.component'; 


@NgModule({
  declarations: [
    AppComponent,
    PlayerSelectorComponent,
    CardDetailComponent,
    ResultComponent,
    AddCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
