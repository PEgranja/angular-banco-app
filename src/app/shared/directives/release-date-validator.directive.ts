import {ValidatorFn, AbstractControl, ValidationErrors} from "@angular/forms";

export function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : {dateNotInPast: true};
  };
}
