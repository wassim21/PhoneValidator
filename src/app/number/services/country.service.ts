import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { countries } from '../consts/countries';
import { LOCALES } from '../consts/countriesNames';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countries: Country[];

  constructor() { }

  /**
   * Returns the countries
   */
  public getCountries(): Country[] {
    if (!this.countries || this.countries.length === 0) {
      this.countries = this.loadCountries();
    }
    return this.countries;
  }

  /**
   * Load and returns the countries
   */
  private loadCountries(locale: any = 'en'): Country[] {
    // let get the locale based country names
    countries.forEach((country: Country) => {
      country.name = LOCALES[locale][country.countryCode]
        .toLowerCase()
        .replace(/\b(\w)/g, s => s.toUpperCase());
    });
    return countries;
  }

  /**
   * search country with Dial Code
   * @param dialCode
   */
  getCountryFromDialCode(dialCode: string) {
    const filteredCountries = countries.filter(country => country.dialCode === dialCode);
    if (filteredCountries.length > 0) {
      return filteredCountries[0];
    }
    return null;
  }

  /**
   * search country with country code
   * @param countryCode
   */
  getCountryFromCountryCode(countryCode: string) {
    const filteredCountries = countries.filter(country => country.countryCode.toLowerCase() === countryCode.toLowerCase());
    if (filteredCountries.length > 0) {
      return filteredCountries[0];
    }
    return null;
  }
}
