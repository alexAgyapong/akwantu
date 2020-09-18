import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    console.log({ token });

    if (req && req.url.endsWith('/oauth2/token')) {
      req = req.clone({ setHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    } else {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
