import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { countries } from '../consts/countries';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private Http: HttpClient) { }
  /**
   * Returns the countries
   */
  public getCountries(language = null): Observable<Country[]> {
    const countryList = [];
    // get the language in the application, if it's not supported, we choose english
    let lang = 'en';
    if (language != null) {
      lang = language;
    }
    // let get the locale based country names
    return this.Http.get('./assets/countries/' + lang + '.json').pipe(map(countriesNames => {
      countries.forEach((country: Country) => {
        const countryName = countriesNames[country.countryCode];
        if (countryName) {
          country.name = countriesNames[country.countryCode]
            .toLowerCase()
            .replace(/\b(\w)/g, s => s.toUpperCase());

          countryList.push(country);
        }
      });
      return countryList;
    }));
  }

  /**
   * search country with country code
   * @param countryCode
   */
  getCountryFromCountryCode(countryCode, countryList) {
    const filteredCountries = countryList.filter(country => country.countryCode.toLowerCase() === countryCode.toLowerCase());
    if (filteredCountries.length > 0) {
      return filteredCountries[0];
    }
    return null;
  }
}
