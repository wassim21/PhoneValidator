import { Component, OnInit, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { CountryService } from './services/country.service';
import { Country } from './models/country.model';
import { NumberService } from './services/number.service';
import { SearchField } from './models/searchField.enum';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl } from '@angular/forms';
import { OutputFormat } from './models/outputFormat.enum';

/**
 * Add bindings configuration in order to add ngModel or formControlName in parent component
 */
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberComponent),
  multi: true
};
/**
 * add validation that will be sended to the parent component
 */
export const RequiredValidation: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NumberComponent),
  multi: true
};

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, RequiredValidation]
})
export class NumberComponent implements OnInit, ControlValueAccessor {
  /**
   * search with dialCode or countryCode or name or all of them
   */
  @Input() searchField: SearchField;
  /**
   * default country
   */
  @Input() defaultCountryCode = '';
  /**
   * list of preferred countries
   */
  @Input() preferredCountryCodes: string[] = [];
  /**
   * place holder in input
   */
  @Input() placeholder = '';
  /**
   * format of phone number after validation
   */
  @Input() outputFormat: OutputFormat = OutputFormat.International;
  /**
   * width of dropdown
   */
  @Input() widthDropdown = '15%';
  /**
   * width of input
   */
  @Input() widthInput = '20%';
  /**
   * height of dropdown and input
   */
  @Input() height = '30px';
  /**
   * outputs the state of phone number
   */
  @Output() state = new EventEmitter();
  /**
   * custom error
   */
  @Output() inputError = new EventEmitter<{ errorCode: number; message: string }>();
  phoneState = null;
  phoneInputError = null;
  /**
   * phone number required
   */
  required = false;
  /**
   * phone number is valid
   */
  isValid = true;
  /**
   * custom errors
   */
  inputErrors: { errorCode: number; message: string }[] = [
    { errorCode: 0, message: 'phone number is required' },
    { errorCode: 1, message: 'phone number must contain + before dial code' },
    { errorCode: 2, message: 'phone number is invalid' },
    { errorCode: 3, message: 'dial code is undefined' },
  ];
  /**
   * list of countries
   */
  countries: Country[] = [];
  /**
   * countries shown in the dropdown
   */
  data: Country[];
  /**
   * selected country
   */
  selectedCountry: Country = {
    name: '',
    dialCode: '',
    countryCode: ''
  };
  /**
   * internal data model that store the phone number
   */
  private innerValue = '';
  /**
   * Placeholders for the callbacks which are later provided
   * by the Control Value Accessor
   */
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(private countryService: CountryService, private numberService: NumberService) { }

  /**
   * on init
   */
  ngOnInit() {
    this.countries = this.getCountries();
    this.data = this.countries;
    this.updatePreferredCountryCodes(this.defaultCountryCode);
    this.updateselectedCountryWithDefault();
    this.verifAndEmit();
  }

  /**
   * filter the list of countries
   * @param value search string
   */
  handleFilter(value: string) {
    this.data = this.searchData(value);
  }

  /**
   * add a country to the list of countries if it dosen't exist
   * @param countryCode country code
   */
  updatePreferredCountryCodes(countryCode: string) {
    if (this.preferredCountryCodes.length > 0) {
      if (countryCode.length > 0 && this.preferredCountryCodes.findIndex(c => countryCode === c) === -1) {
        this.preferredCountryCodes.push(countryCode);
      }
      this.getPreferredCountries();
    }
  }

  /**
   * update selected country with the default country
   */
  updateselectedCountryWithDefault() {
    if (this.defaultCountryCode.length > 0) {
      const country = this.countryService.getCountryFromCountryCode(this.defaultCountryCode);
      if (country !== null) {
        this.selectedCountry = country;
      }
    }
  }

  /**
   * get the list of preferred countries ordered by name
   */
  getPreferredCountries() {
    this.data = [];
    this.preferredCountryCodes.forEach(countryCode => {
      const countries = this.countries.filter((s) => s.countryCode.toLowerCase() === countryCode);
      this.data.push(...countries);
    });
    this.data = this.data.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * search data based on serach field
   * @param value serach string
   */
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

  /**
   * search With Dial Code
   * @param value serach string
   */
  searchWithDialCode(value: string) {
    return this.countries.filter((s) => s.dialCode.toLowerCase().indexOf(value) !== -1);
  }

  /**
   * search With Name
   * @param value serach string
   */
  searchWithName(value: string) {
    return this.countries.filter((s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  /**
   * search With Country Code
   * @param value serach string
   */
  searchWithCountryCode(value: string) {
    return this.countries.filter((s) => s.countryCode.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  /**
   * search With all fields
   * @param value serach string
   */
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

  /**
   * input verification
   */
  verif() {
    this.phoneInputError = null;
    this.isValid = false;
    if (this.required && this.phoneNumber.length === 0) {
      this.phoneInputError = this.inputErrors[0];
    } else if (this.phoneNumber.length > 0) {
      if (Number(this.removeSpacesAndHyphens(this.phoneNumber))) {
        if (this.phoneNumber.startsWith('+')) {
          const pn = new PhoneNumber(this.phoneNumber);
          this.phoneState = pn.toJSON();
          this.checkDialCodeAndUpdate(this.phoneState);
        } else {
          this.phoneInputError = this.inputErrors[1];
          this.ResetSelectedCountry();
        }
      } else {
        this.phoneInputError = this.inputErrors[2];
      }
    }
  }

  /**
   * emit to parent component
   */
  emit() {
    this.inputError.emit(this.phoneInputError);
    this.state.emit(this.phoneState);
  }

  verifAndEmit() {
    this.verif();
    this.emit();
  }

  checkDialCodeAndUpdate(phoneState) {
    if (phoneState.regionCode !== null) {
      this.selectedCountry = this.countryService.getCountryFromCountryCode(phoneState.regionCode);
      if (phoneState.valid) {
        this.isValid = true;
        this.phoneNumber = this.formatPhoneNumber(phoneState.number);
        if (this.preferredCountryCodes.length > 0) {
          this.updatePreferredCountryCodes(phoneState.regionCode);
        }
      } else {
        this.phoneInputError = this.inputErrors[2];
      }
    } else {
      this.phoneInputError = this.inputErrors[3];
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

  /**
   * only numbers can be typed
   * @param event
   */
  validateNumber(event) {
    return this.numberService.validateNumber(event);
  }

  /**
   * remove spaces and hyphens from a word
   * @param word
   */
  removeSpacesAndHyphens(word) {
    return word.replace(/\s|-/g, '');
  }

  /**
   * format phone number
   * @param phoneStateNumber
   */
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

  /**
   * implement ControlValueAccessor
   */
  writeValue(value: any) {
    if (value !== this.innerValue && value != null) {
      this.innerValue = value;
    }
  }

  /**
   * implement ControlValueAccessor
   */
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  /**
   * implement ControlValueAccessor
   */
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  /**
   * implement ControlValueAccessor
   */
  validate(c: FormControl) {
    this.verifAndEmit();
    if (!this.required && c.errors !== null && c.errors.required === true) {
      this.required = true;
    }
    if (c.value === '' && (c.errors == null || (c.errors !== null && c.errors.required === undefined))) {
      this.isValid = true;
      return true;
    }
    return !this.isValid && {
      invalid: true
    };
  }

  get phoneNumber(): any {
    return this.innerValue;
  }

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

}

export const PhoneNumber = require('awesome-phonenumber');
