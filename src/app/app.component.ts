import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  title = 'PhoneValidator';
  inputError = '';
  preferredCountryCodes = ['nl', 'fr'];
  form1 = new FormGroup({
    phoneNumber: new FormControl('')
  });
  form2 = new FormGroup({
    phoneNumber: new FormControl('', Validators.required)
  });
  phoneNumber1 = '+21621313562';
  phoneNumber2 = '';
  phoneNumber3 = '';
  phoneNumber4 = '';
  state ;
  ngOnInit(): void {
  }

  getState(json) {
    this.state = json;
    console.log(json);
  }

  getInputError(inputError) {
    this.inputError = '';
    if (inputError !== null) {
      this.inputError = inputError;
    }
  }


}
