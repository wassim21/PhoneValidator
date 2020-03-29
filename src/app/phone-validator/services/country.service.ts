import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { countries } from '../consts/countries';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private translate: TranslateService, private Http: HttpClient) { }

  /**
   * Returns the countries
   */
  public getCountries(language = null, supportedLanguages = ['en']): Observable<Country[]> {
    // get the language in the application, if it's not supported, we choose english
    let lang;
    if (language != null) {
      lang = language;
    } else {
      lang = this.translate.getDefaultLang();
      if (!supportedLanguages.find(x => x === lang)) {
        lang = 'en';
      }
    }
    // let get the locale based country names
    return this.Http.get('./assets/countries/' + lang + '.json').pipe(map(countriesNames => {
      countries.forEach((country: Country) => {
        country.name = countriesNames[country.countryCode]
          .toLowerCase()
          .replace(/\b(\w)/g, s => s.toUpperCase());
      });
      return countries;
    }));

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
