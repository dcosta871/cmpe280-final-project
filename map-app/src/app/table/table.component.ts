import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Ride } from '../ride';
import { ParkApiService } from '../park-api.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['ride', 'park'];
  ridesSubscription: Subscription;
  rides = [];
  dataSource: MatTableDataSource < {} >;
  constructor(private rideApiService: ParkApiService) { }

  ngOnInit() {
    this.ridesSubscription = this.rideApiService.getParks().subscribe(res => {
      this.dataSource = new MatTableDataSource([]);
      const keys = Object.keys(res.body);
      for (const key of keys) {
        const parkRides = res.body[key].rides;
        const parkName = res.body[key].parkName
        for (const ride of parkRides) {
          this.rides.push();
          const data = this.dataSource.data;
          data.push({
            ride: ride.rideName,
            park: parkName
          });
          this.dataSource.data = data;
        }
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
