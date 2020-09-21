import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material/material.module';
import { SearchComponent } from './shared/components/search/search.component';
import { AppInterceptor } from './app-interceptor';

/* Libraries */
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { FlightListComponent } from './flights/flight-list/flight-list.component';
import { FlightCardComponent } from './flights/flight-card/flight-card.component';
import { TimePipe } from './shared/pipes/time.pipe';
import { FormatDurationPipe } from './shared/pipes/format-duration.pipe';
import { FilterComponent } from './shared/components/filter/filter.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    FlightListComponent,
    FlightCardComponent,
    TimePipe,
    FormatDurationPipe,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot()


  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
