import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';
import {catchError, tap, throwError} from 'rxjs';

// We define the "TokenResponse"
type TokenResponse = {
  token: string;
}

// We define the "RegisterRequest"
type RegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN" | "MANAGER";
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:8080/api/auth";

  // we need the HttpClient & inject it
  private http = inject(HttpClient);

  // we need the StorageService & inject it
  private storageService = inject(StorageService);

  // we need to inject the router because after login & registration i want this component to be able to redirect the page
  private router = inject(Router);

  // we angular new inject method we do not need this anymore
  //constructor() { }

  // We will implement 3 methods: login, register, logout
  // Login method will receive: email & password
  login(email: string, password: string) {
    // we use HttpClient that we have previous injected and its post method
    // the post method takes the url "${this.apiUrl}/login", a body "{email, password}" & any optional options
    // this post Observable will resolve/return to be a "TokenResponse"
    // when that comes back I want to pipe its output
    // pipe allows me to carry out multiple operations for every return that this http post request will make
    // I want to tap into that, which is an RxJS method and with that response
    // I want to extract the token and use my storageService to set it
    // and then I want to redirect my application to the "BASE_URL" which is "/"
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, {email, password})
      .pipe(
        tap((response) => {
          this.storageService.setToken(response.token);
          this.router.navigate(['/']);
        }),
        // if something goes wrong I want to catch the error and declare that there's an incorrect login
        catchError((error) => {
          return throwError(() => new Error('Incorrect login, please try again.'));
        })
      );

  }

  // Register method will need to pass in: firstname, lastname etc
  register({ firstname, lastname, email, password, role }: RegisterRequest) {
    // we use HttpClient that we have previous injected and its post method
    // the post method takes the url "${this.apiUrl}/register", a body "{ firstname, lastname, email, password, role }" & any optional options
    // this post Observable will resolve/return to be a "RegisterRequest"
    // when that comes back I want to pipe its output
    // pipe allows me to carry out multiple operations for every return that this http post request will make
    // I want to tap into that, which is an RxJS method and with that response
    return this.http.post<TokenResponse>(`${this.apiUrl}/register`, { firstname, lastname, email, password, role })
      // when that comes back I want to pipe its output
      // pipe allows me to carry out multiple operations for every return that this http post request will make
      // I want to tap into that, which is an RxJS method and with that response
      .pipe(
        tap((response) => {
          // we set our token because registering also returns with a new token
          this.storageService.setToken(response.token);
          this.router.navigate(['/']);
        }),
        // if something goes wrong I want to catch the error and declare that there's an incorrect login
        catchError((error) => {
          return throwError(() => new Error('Incorrect register, please try again.'));
        })
      );
  }

  // Logout method
  logout() {
    // we'll cleat the token
    this.storageService.clearToken();
    this.router.navigate(['/login']);
  }

  // We have a helper method called isLoggedIn
  isLoggedIn() {
    // return a boolean based on whether there's a token
    // if there is a token then will return true else if null will return false
    return Boolean(this.storageService.getToken());
  }

}
