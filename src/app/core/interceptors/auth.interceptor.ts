import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('/bp/products/verification')) {
      request = request.clone({
        headers: request.headers
          //.set('Content-Type', 'application/json')
          .set('authorId', environment.authorIdKey),
      });
      return next.handle(request);
    } else {
      return next.handle(request);
    }
  }
}
