import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { ServerApiService } from '../server-api.service';
import { EventService } from '../event.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['ride', 'park'];
  ridesSubscription: Subscription;
  eventParkFilterSubscription: Subscription;
  eventDateChangeSubscription: Subscription;
  rides = [];
  parkFilter = 'All Parks';
  dataSource: MatTableDataSource < {} >;
  favoriteRides: string[];

  constructor(private serverApiService: ServerApiService, private eventService: EventService) {
    eventService.favoriteRidesObtained$.subscribe(favoriteRides => {
      this.favoriteRides = favoriteRides;
      if (this.parkFilter === 'Favorite Rides') {
        this.filterRows();
      }
    });
  }

  ngOnInit() {
    this.ridesSubscription = this.serverApiService.getParks().subscribe(res => {
      this.dataSource = new MatTableDataSource([]);
      const keys = Object.keys(res.body);
      for (const key of keys) {
        const parkRides = res.body[key].rides;
        const parkName = res.body[key].parkName;
        for (const ride of parkRides) {
          this.rides.push({
            ride: ride.rideName,
            park: parkName
          });
          const data = this.dataSource.data;
          data.push({
            ride: ride.rideName,
            park: parkName
          });
          this.dataSource.data = data;
        }
      }
    });

    this.eventParkFilterSubscription = this.eventService.parkFilter$.subscribe(parkFilter => {
      this.parkFilter = parkFilter;
      this.filterRows();
    });
  }

  getRecord(row) {
    this.eventService.rideChange(row.ride, true);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.ridesSubscription) {
      this.ridesSubscription.unsubscribe();
    }
  }

  filterRows() {
    this.dataSource = new MatTableDataSource([]);
    const data = this.dataSource.data;
    for (const ride of this.rides) {
      if (ride.park === this.parkFilter || this.parkFilter === 'All Parks' ||
          (this.parkFilter === 'Favorite Rides' && this.favoriteRides.indexOf(ride.ride) > -1)) {
        data.push(ride);
      }
    }
    this.dataSource.data = data;
  }

}
