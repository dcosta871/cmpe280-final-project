import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Park } from './park';
import { FLASK_URL } from '../environments/environment';
import { Metric } from './metric';

@Injectable({
  providedIn: 'root'
})
export class ParkApiService {

  constructor(private http: HttpClient) {}

  getParks(): Observable<HttpResponse<Park[]>> {
    return this.http.get<Park[]>(FLASK_URL + '/api/parks', {observe: 'response'});
  }

  getPrediction(predictInput): Observable<Metric[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Metric[]>(FLASK_URL + '/api/predict', predictInput, httpOptions);
  }
}
