import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { CountryService } from './services/country.service';
import { NumberService } from './services/number.service';
import { NumberComponent } from './number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [NumberComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NumberComponent],
  providers: [CountryService, NumberService],
})
export class NumberModule { }
