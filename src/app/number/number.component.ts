import { Component, OnInit, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { CountryService } from './services/country.service';
import { Country } from './models/country.model';
import { NumberService } from './services/number.service';
import { SearchField } from './models/searchField.enum';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormControl, Validators } from '@angular/forms';
import { OutputFormat } from './models/outputFormat.enum';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberComponent),
  multi: true
};
@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NumberComponent implements OnInit, ControlValueAccessor {
  @Input() required = false;
  @Input() searchField;
  @Input() defaultCountryCode = '';
  @Input() preferredCountryCodes: string[] = [];
  @Input() placeholder = '';
  @Input() outputFormat: OutputFormat = OutputFormat.International;
  @Input() widthDropdown = '15%';
  @Input() widthInput = '20%';
  @Input() height = '30px';
  @Output() state = new EventEmitter();
  @Output() inputError = new EventEmitter<{ errorCode: number; message: string }>();


  inputErrors: { errorCode: number; message: string }[] = [
    { errorCode: 0, message: 'phone number is required' },
    { errorCode: 1, message: 'phone number must contain + before dial code' },
    { errorCode: 2, message: 'phone number is invalid' },
    { errorCode: 3, message: 'dial code is undefined' },
  ];

  countries: Country[] = [];
  data: Country[];
  selectedCountry: Country = {
    name: '',
    dialCode: '',
    countryCode: ''
  };

  // The internal data model
  private innerValue: any = '';
  // Placeholders for the callbacks which are later provided
  // by the Control Value Accessor
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(private countryService: CountryService, private numberService: NumberService) { }

  ngOnInit() {
    this.countries = this.getCountries();
    this.data = this.countries;
    this.updatePreferredCountryCodes(this.defaultCountryCode);
    this.updateselectedCountryWithDefault();
    this.verifAndEmit();
  }

  handleFilter(value: string) {
    this.data = this.searchData(value);
  }

  updatePreferredCountryCodes(countryCode: string) {
    if (this.preferredCountryCodes.length > 0) {
      if (countryCode.length > 0 && this.preferredCountryCodes.findIndex(c => countryCode === c) === -1) {
        this.preferredCountryCodes.push(countryCode);
      }
      this.getPreferredCountries();
    }
  }

  updateselectedCountryWithDefault() {
    if (this.defaultCountryCode.length > 0) {
      const country = this.countryService.getCountryFromCountryCode(this.defaultCountryCode);
      if (country !== null) {
        this.selectedCountry = country;
      }
    }
  }

  getPreferredCountries() {
    this.data = [];
    this.preferredCountryCodes.forEach(countryCode => {
      const countries = this.countries.filter((s) => s.countryCode.toLowerCase() === countryCode);
      this.data.push(...countries);
    });
    this.data = this.data.sort((a, b) => a.name.localeCompare(b.name));
  }

  searchData(value: string) {
    switch (this.searchField) {
      case SearchField.DialCode:
        return this.searchWithDialCode(value);

      case SearchField.CountryCode:
        return this.searchWithCountryCode(value);

      case SearchField.Name:
        return this.searchWithName(value);

      default:
        return this.searchWithAllFields(value);
    }
  }

  searchWithDialCode(value: string) {
    return this.countries.filter((s) => s.dialCode.toLowerCase().indexOf(value) !== -1);
  }

  searchWithName(value: string) {
    return this.countries.filter((s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  searchWithCountryCode(value: string) {
    return this.countries.filter((s) => s.countryCode.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  searchWithAllFields(value: string) {
    if (Number(value)) {
      return this.searchWithDialCode(value);
    } else {
      if (value.length <= 2) {
        const results = this.searchWithCountryCode(value);
        if (results.length > 0) {
          return results;
        }
      }
      return this.searchWithName(value);
    }
  }

  verifAndEmit() {
    this.inputError.emit(null);
    if (this.required && this.phoneNumber.length === 0) {
      this.inputError.emit(this.inputErrors[0]);
    } else if (this.phoneNumber.length > 0) {
      if (Number(this.removeSpacesAndHyphens(this.phoneNumber))) {
        if (this.phoneNumber.startsWith('+')) {
          const pn = new PhoneNumber(this.phoneNumber);
          const phoneState = pn.toJSON();
          this.state.emit(phoneState);
          this.checkDialCodeAndUpdate(phoneState);
        } else {
          this.inputError.emit(this.inputErrors[1]);
          this.ResetSelectedCountry();
        }
      } else {
        this.inputError.emit(this.inputErrors[2]);
      }
    }
  }

  checkDialCodeAndUpdate(phoneState) {
    if (phoneState.regionCode !== null) {
      this.selectedCountry = this.countryService.getCountryFromCountryCode(phoneState.regionCode);
      if (phoneState.valid) {
        this.phoneNumber = this.formatPhoneNumber(phoneState.number);
        if (this.preferredCountryCodes.length > 0) {
          this.updatePreferredCountryCodes(phoneState.regionCode);
        }
      } else {
        this.inputError.emit(this.inputErrors[2]);
      }
    } else {
      this.inputError.emit(this.inputErrors[3]);
      this.ResetSelectedCountry();
    }
  }

  ResetSelectedCountry() {
    this.selectedCountry = {
      name: '',
      dialCode: '',
      countryCode: ''
    };
  }


  updatephoneNumber() {
    this.phoneNumber = '+' + this.selectedCountry.dialCode + ' ';
    this.verifAndEmit();
  }

  getCountries() {
    return this.countryService.getCountries();
  }

  keyDown(event) {
    if (event.keyCode === 13) {
      this.verifAndEmit();
    }
  }

  validateNumber(event) {
    return this.numberService.validateNumber(event);
  }

  removeSpacesAndHyphens(word) {
    return word.replace(/\s|-/g, '');
  }


  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }


  // get accessor
  get phoneNumber(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set phoneNumber(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  changefn(): void { this.onChangeCallback(this.phoneNumber); }

  onBlur() {
    this.onTouchedCallback();
  }

  formatPhoneNumber(phoneStateNumber) {
    switch (this.outputFormat) {
      case OutputFormat.E164:
        return phoneStateNumber.e164;

      case OutputFormat.Input:
        return phoneStateNumber.input;

      case OutputFormat.International:
        return phoneStateNumber.international;

      case OutputFormat.National:
        return phoneStateNumber.national;

      case OutputFormat.Rfc3966:
        return phoneStateNumber.rfc3966;

      default:
        return phoneStateNumber.international;
    }
  }

  getErrorCondition() {

  }
}

export const PhoneNumber = require('awesome-phonenumber');
