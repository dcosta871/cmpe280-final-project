import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Park } from './park';
import { FLASK_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkApiService {

  constructor(private http: HttpClient) {}

  getParks(): Observable<HttpResponse<Park[]>> {
    return this.http.get<Park[]>(FLASK_URL + '/parks', {observe: 'response'});
  }
}
