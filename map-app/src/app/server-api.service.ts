import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Park } from './park';
import { FLASK_URL } from '../environments/environment';
import { Metric } from './metric';
import { EventService } from './event.service';

interface UserInfoResponse {
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerApiService {

  public userName: string;

  constructor(private http: HttpClient, private eventService: EventService) {
    if (localStorage.getItem('rides_app_token')) {
      this.getUserInfo().subscribe(res => {
        eventService.userChange(res.userName);
      }, err => {
        localStorage.removeItem('rides_app_token');
      });
    }
  }

  getParks(): Observable<HttpResponse<Park[]>> {
    return this.http.get<Park[]>(FLASK_URL + '/api/parks', {observe: 'response'});
  }

  getPrediction(predictData): Observable<Metric[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Metric[]>(FLASK_URL + '/api/predict', predictData, httpOptions);
  }

  login(loginData): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<object>(FLASK_URL + '/api/login', loginData, httpOptions);
  }

  logout(): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rides_app_token')}`
      })
    };
    return this.http.post<object>(FLASK_URL + '/api/logout', {}, httpOptions);
  }

  createUser(userData): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<object>(FLASK_URL + '/api/create_user', userData, httpOptions);
  }

  getUserInfo(): Observable<UserInfoResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rides_app_token')}`
      })
    };
    return this.http.get<UserInfoResponse>(FLASK_URL + '/api/user', httpOptions);
  }

  getFavoriteRides(): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rides_app_token')}`
      })
    };
    return this.http.get<object>(FLASK_URL + '/api/favorite_rides', httpOptions);
  }

  setFavoriteRides(favoriteRides): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rides_app_token')}`
      })
    };
    return this.http.post<object>(FLASK_URL + '/api/favorite_rides', favoriteRides, httpOptions);
  }
}
