import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { ParkApiService } from '../park-api.service';
import { EventService } from '../event.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['ride', 'park'];
  ridesSubscription: Subscription;
  eventSubscription: Subscription;
  rides = [];
  dataSource: MatTableDataSource < {} >;
  constructor(private rideApiService: ParkApiService, private eventService: EventService) { }

  ngOnInit() {
    this.ridesSubscription = this.rideApiService.getParks().subscribe(res => {
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

    this.eventSubscription = this.eventService.parkFilter$.subscribe(parkFilter => {
      this.dataSource = new MatTableDataSource([]);
      const data = this.dataSource.data;
      for (const ride of this.rides) {
        if (ride.park === parkFilter || parkFilter === 'All Parks') {
          data.push(ride);
        }
      }
      this.dataSource.data = data;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.ridesSubscription) {
      this.ridesSubscription.unsubscribe();
    }
  }

}
