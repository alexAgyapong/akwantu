import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  expiresAt: number;
  TOKEN_BUFFER = 10;

  constructor(private http: HttpClient) { }

  getAccessToken(): Observable<TokenResponse> {

    const url = `${environment.baseURL}/v1/security/oauth2/token`;
    const payload = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', environment.apiKey)
      .set('client_secret', environment.apiSecret);
    return this.http.post<TokenResponse>(url, payload)
      .pipe(
        tap(res => {
          localStorage.setItem('accessToken', res.access_token);
          this.expiresAt = Date.now() + (res.expires_in) * 1000;
          // this.token = res.access_token;
          // localStorage.setItem('accessToken', res.access_token);
          localStorage.setItem('expireAt', this.expiresAt.toString());
          // console.log('.... NEW token from API here...', this.token);
        })
        // map(res => res.access_token)
      );
  }


  isTokenValid(): boolean {
    const tokenExpiration = +localStorage.getItem('expireAt');
    const accessToken = localStorage.getItem('accessToken');
    console.log('.... token plus buffer...', (Date.now() + this.TOKEN_BUFFER), 'expire at', tokenExpiration);
    console.log('access from storage', accessToken);

    if (!accessToken) { console.log('here for no access token'); return false; }
    else if ((Date.now() + this.TOKEN_BUFFER) < tokenExpiration) {
      console.log('here for real');
      return true;
    }
    else { console.log('here for false'); return false; }
  }
}

export interface TokenResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}