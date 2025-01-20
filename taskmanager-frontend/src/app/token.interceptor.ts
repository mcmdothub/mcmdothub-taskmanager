import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from './services/storage.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// our tokenInterceptor is going to take the current request and has this next function that it's going to be able to invoke
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // inject StorageService to get our token
  const storageService = inject(StorageService);

  // we want to redirect if the token is wrong, so we inject our router
  const router = inject(Router);

  // get the token
  const token = storageService.getToken();

  // if there is a token
  if (token) {
    // we take the current request and clone it
    req = req.clone({
      // we set the headers, specifically the Authorization, and we set it to "Bearer + token"
      // so exactly what we were checking for, on the backend
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // then we return the request, which is our updated request, which will have the token
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        storageService.clearToken();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
