import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'PhoneValidator';
  inputError = '';
  preferredCountryCodes = ['nl', 'fr'];
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
