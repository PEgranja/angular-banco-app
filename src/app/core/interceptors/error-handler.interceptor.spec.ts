import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpInterceptorFn} from '@angular/common/http';

import {errorHandlerInterceptor} from './error-handler.interceptor';
import {HttpTestingController, HttpClientTestingModule} from '@angular/common/http/testing';

describe('errorHandlerInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorHandlerInterceptor(req, next));
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: HTTP_INTERCEPTORS, useValue: errorHandlerInterceptor, multi: true}],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should format error message for ErrorEvent', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBe('Error: Test error message');
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.error(new ErrorEvent('Network error', {message: 'Test error message'}));
  });

  it('should format error message for HttpErrorResponse', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBe('Error code: 404, message: Not Found');
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });

  /*it('should handle unknown errors gracefully', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBe('Error code: 500, message: Unknown Error');
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush('Unknown Error', {status: 500, statusText: 'Internal Server Error'});
  });*/
});
