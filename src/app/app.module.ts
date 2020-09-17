import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material/material.module';
import { SearchComponent } from './shared/components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';

/* Libraries */
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
