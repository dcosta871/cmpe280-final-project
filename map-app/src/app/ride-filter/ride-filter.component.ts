import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParkApiService } from '../park-api.service';
import { Subscription } from 'rxjs';
import { EventService } from '../event.service';

@Component({
  selector: 'app-ride-filter',
  templateUrl: './ride-filter.component.html',
  styleUrls: ['./ride-filter.component.scss']
})
export class RideFilterComponent implements OnInit, OnDestroy {
  parks: string[] = ['All Parks'];
  parksSubscription: Subscription;
  parkFilter = 'All Parks';
  constructor(private parkApiService: ParkApiService, private eventService: EventService) { }

  ngOnInit() {
    // Get list of rides from server
    this.parksSubscription = this.parkApiService.getParks().subscribe(res => {
      const keys = Object.keys(res.body);
      for (const key of keys) {
        this.parks.push(res.body[key].parkName);
      }
    });
  }

  onParkChange(park): void {
    this.eventService.parkFilter(park);
  }

  ngOnDestroy(): void {
    if (this.parksSubscription) {
      this.parksSubscription.unsubscribe();
    }
  }



}