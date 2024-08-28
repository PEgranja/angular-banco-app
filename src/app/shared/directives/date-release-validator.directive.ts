import {Directive, Input} from '@angular/core';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
  Validator,
} from '@angular/forms';

export function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validateDate = new Date(today);
    validateDate.setDate(today.getDate() - 1);

    return inputDate >= validateDate ? null : {dateNotInPast: true};
  };
}

@Directive({
  selector: '[appDateNotInPast]',
  providers: [{provide: NG_VALIDATORS, useExisting: releaseDateValidatorDirective, multi: true}],
})
export class releaseDateValidatorDirective implements Validator {
  @Input('appDateNotInPast') dateNotInPast = '';
  validate(control: AbstractControl): ValidationErrors | null {
    return this.dateNotInPast ? releaseDateValidator()(control) : null;
  }
}
