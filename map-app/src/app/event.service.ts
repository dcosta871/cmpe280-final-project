import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  private parkFilterSource = new Subject<string>();

  parkFilter$ = this.parkFilterSource.asObservable();

  parkFilter(mission: string) {
    this.parkFilterSource.next(mission);
  }

}
