import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'PhoneValidator';
  inputError = '';
  preferredCountryCodes = ['nl', 'fr'];
  // form = new FormGroup({
  //   phoneNumber: new FormControl('')
  // });
  ngOnInit(): void {
  }

  getState(json) {
    console.log(json);
  }

  getInputError(inputError) {
    this.inputError = '';
    if (inputError !== null) {
      this.inputError = inputError;
    }
  }


}
