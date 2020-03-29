# w-phone-validator

A simple phone validator. Allows you to check a phone number and give some details.
Exemples of usage are provided in https://github.com/wassim21/PhoneValidator/blob/master/src/app/app.component.html.
We used awesome-phonenumber as library to validate phone number provided in https://github.com/grantila/awesome-phonenumber
This phone validator is multilingual. We provide for an english version of list of countries.

## Installation

To install this library, run:

```bash
$ npm i w-phone-validator
```

## Third Parties

This library uses as third party ngx-transalate provided in https://github.com/ngx-translate/core
To install this library, run:

```bash
$ npm install @ngx-translate/core --save
$ npm install @ngx-translate/http-loader --save
```

Install also types/node by running

```bash
$ npm i @types/node
```

## Consuming your library

Once you have installed it you can import `PhoneValidatorModule` from `w-phone-validator` in any application module. E.g.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhoneValidatorModule } from 'w-phone-validator';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // the phone validator
    PhoneValidatorModule,
    // forms and reactive forms to create form group and bind with ngModel
    FormsModule,
    ReactiveFormsModule,
    // Translate module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

```

We need also to add "node" in types section in tsconfig.app.json
```json
{
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": [
      "node"
    ]
  }
}

```
under assets add new folder called countries and under that folder add en.json that contain the english version of countries provided in https://github.com/wassim21/PhoneValidator/blob/master/src/assets/countries/en.json

Also, under assets add a folder called i18n and under that folder add a new json file (if dosen't exist already) called en.json. This will contain all the translation of your future app. For more details, you can visit https://github.com/ngx-translate/core

Once this configuration is done, you can use `w-phone-validator`:

```xml
<!-- app.component.html -->
<phone-validator [(ngModel)]="phoneNumber"></phone-validator>

```

### Attributes/Options:

Those attributes are optionnal inputs:
       searchField: search based on search field. Possible search Field are: dialCode - countryCode - name - all. Per default it's setted to all.
       defaultCountryCode: display the default country by setting the defaultCountryCode with a choosen country code. The list of countries is provided in the english json file.
       preferredCountryCodes: the list of preferred Country Codes. exemple: preferredCountryCodes="['tn', 'nl']", etc..
       placeholder: the placeholder of the input
       outputFormat: format of phone number after validation. Possible output format are input (written by the user) -  e164 - international - national - rfc3966. For more details visit https://github.com/grantila/awesome-phonenumber
       widthInput: the width of the input.
       height: height of dropdown and input
       language: the language of countries in dropdown.When the languge is provided the system display the values of the selected langugage. This languge must be provided under assets/countries with lang.json like en.json or fr.json, etc... .When no language is provided the system display the countries with the browser language which must must be provided in supportedLanguages. Exemple: [language]="'en'".
       supportedLanguages: is optionnal, but when the language is not provided it becomes mandatory. exmple: supportedLanguages=['en']

Those attributes are optionnal outputs:
       state: provide a short description of the phone number written by the user for instance: valid or invalid, fixe or mobile, etc...
       inputError: a custom message to describe the user input. Exemple: "phone number must contain + before dial code"


## Troubleshooting:
If you are getting error "Can't resolve 'awesome-phonenumber'" while building with aot, try to install awesome-phonenumber. Run npm install npm i awesome-phonenumber.
For the other issues you can report them in https://github.com/wassim21/PhoneValidator/issues


## Authors
    * Author: wassim mhiri 
## License

ISC
