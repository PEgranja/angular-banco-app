import {HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {catchError, map, throwError} from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      let message = '';
      if (event instanceof HttpResponse) {
        message = 'Accion exitosa';
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        //errorMessage = `Error code: ${error.status}, message: ${error.message}`;
        errorMessage = 'Sistema no disponible';
      }

      return throwError(() => errorMessage);
    }),
  );
};
