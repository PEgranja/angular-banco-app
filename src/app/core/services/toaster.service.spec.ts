import {TestBed} from '@angular/core/testing';
import {ToasterService} from './toaster.service';
import {Subject, of} from 'rxjs';

describe('ToasterService', () => {
  let service: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToasterService],
    });
    service = TestBed.inject(ToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit toast messages when showToast is called', () => {
    const toastMessage: {message: string; type: 'success' | 'error' | 'info' | 'warning'} | null = {
      message: 'Test Message',
      type: 'info',
    };
    let emittedMessage: any;

    service.toast$.subscribe((message) => (emittedMessage = message));
    service.showToast(toastMessage!.message, toastMessage!.type);

    expect(emittedMessage).toEqual(toastMessage);
  });

  it('should set and get a message with setMessage and getMessage', () => {
    const testMessage: {message: string; type: 'success' | 'error' | 'info' | 'warning'} | null = {
      message: 'Test Message',
      type: 'info',
    };

    service.setMessage(testMessage!.message, testMessage!.type);
    const message = service.getMessage();

    expect(message).toEqual(testMessage);
    expect(service.getMessage()).toBeNull();
  });

  it('should return null if no message has been set', () => {
    const message = service.getMessage();
    expect(message).toBeNull();
  });
});
