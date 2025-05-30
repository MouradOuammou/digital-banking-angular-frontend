  import { Injectable } from '@angular/core';
  import {HttpClient} from "@angular/common/http";
  import {environment} from "../environments/environment";
  import {Observable} from "rxjs";
  import {AccountDetails} from "../model/account.model";

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    constructor(private http: HttpClient) { }

    public login(username: string, password: string): Observable<any> {
      const body = { username, password };
      return this.http.post(environment.backendHost + "/authenticate", body);
    }
    public logout(): Observable<any> {
      return this.http.post(environment.backendHost + "/logout", {});
    }
  }

