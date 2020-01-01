import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NumberComponent } from './number/number.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from './number/country.service';
import { NumberService } from './number/number.service';

@NgModule({
  declarations: [
    AppComponent,
    NumberComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropDownsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CountryService, NumberService],
  bootstrap: [AppComponent]
})
export class AppModule { }
