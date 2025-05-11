import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from '../../assets/config/config.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;

  constructor(private http: HttpClient) { 
    const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
    this.loggedIn = !!loggedInUser;
  }

  // Method to obtain a new access token using the refresh token
  getAccessToken(){
    const body = new URLSearchParams();
    body.set('client_id', config.CLIENT_ID);
    body.set('client_secret', config.CLIENT_SECRET);
    body.set('refresh_token', config.REFRESH_TOKEN);
    body.set('grant_type', 'refresh_token');

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    // Send POST request to obtain new access token
    return this.http.post(config.TOKEN_URL, body.toString(), { headers });
  }

}
