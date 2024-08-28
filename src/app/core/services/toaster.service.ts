import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastSubject = new Subject<{
    text: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>();
  toast$ = this.toastSubject.asObservable();
  private toasterMessage: {message: string; type: 'success' | 'error' | 'info' | 'warning'} | null =
    null;

  showToast(text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    this.toastSubject.next({text, type});
  }

  setMessage(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toasterMessage = {message, type};
  }

  getMessage() {
    const message = this.toasterMessage;
    this.toasterMessage = null;
    return message;
  }
  constructor() {}
}
