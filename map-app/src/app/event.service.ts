import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface RideChange {
  ride: string;
  adjust: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  private parkFilterSource = new Subject<string>();
  private dateChangeSource = new Subject<Date>();
  private rideChangeSource = new Subject<RideChange>();

  parkFilter$ = this.parkFilterSource.asObservable();
  dateChange$ = this.dateChangeSource.asObservable();
  rideChange$ = this.rideChangeSource.asObservable();

  parkFilter(mission: string) {
    this.parkFilterSource.next(mission);
  }

  dateChange(date: Date) {
    this.dateChangeSource.next(date);
  }

  rideChange(rideName: string, readjustMap: boolean) {
    this.rideChangeSource.next({ride: rideName, adjust: readjustMap});
  }
}