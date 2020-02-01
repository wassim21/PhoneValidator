import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
