import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { CountryService } from './services/country.service';
import { NumberService } from './services/number.service';
import { PhoneValdiatorComponent } from './phone-validator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PhoneValdiatorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [PhoneValdiatorComponent],
  providers: [CountryService, NumberService],
})
export class PhoneValidatorModule { }
