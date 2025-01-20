import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// We use localStorage to store my JWT
// I do not want to access my localStorage each time
// we will have a cacheToken which will exists in memory & a private variable for the "TOKEN_KEY"
export class StorageService {
  private _cacheToken: string | null = null;      // can be string or null and we instantiate as null

  private TOKEN_KEY = 'AUTH_TOKEN_KEY';

  setToken(token: string) {
    // protects us if you are doing server-side rendering, this becomes more of an issue
    if (!window) {
      return;
    }

    // set the cacheToken to be that token
    this._cacheToken = token;

    // this will only work on the browser
    localStorage.setItem(this.TOKEN_KEY, token);    // 'AUTH_TOKEN_KEY' = token
  }

  getToken(): string | null | void {
    // protects us if you are doing server-side rendering, this becomes more of an issue
    if (!window) {
      return;
    }

    if(!this._cacheToken) {
      this._cacheToken = window.localStorage.getItem(this.TOKEN_KEY);
    }

    return  this._cacheToken;
  }

  clearToken() {
    if (!window) {
      return;
    }

    this._cacheToken = null;

    window.localStorage.removeItem(this.TOKEN_KEY);
  }
}
