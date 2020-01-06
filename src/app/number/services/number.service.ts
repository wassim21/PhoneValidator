import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
/**
 * helper that allow to type specific caracters
 */
export class NumberService {
    /**
     * allow only numbers, space, + , -
     * @param event
     */
    validateNumber(event): boolean {
        let valid = true;
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            valid = false;
        }
        if (charCode === 43 || charCode === 32 || charCode === 45) {
            valid = true;
        }
        return valid;

    }
}
