import { Component, OnInit } from '@angular/core';
import { FavoriteRidesSelectorComponent } from '../favorite-rides-selector/favorite-rides-selector.component';
import { MatDialog } from '@angular/material';
import { EventService } from '../event.service';
import { ServerApiService } from '../server-api.service';

interface FavoriteRidesResponse {
  favoriteRides: [];
}

@Component({
  selector: 'app-favorite-rides',
  templateUrl: './favorite-rides.component.html',
  styleUrls: ['./favorite-rides.component.scss']
})
export class FavoriteRidesComponent implements OnInit {
  isLoggedIn = false;
  totalRides = [];
  favoriteRides = [];

  constructor(public dialog: MatDialog, private eventService: EventService, private serverAPIService: ServerApiService) {
    const userChangeSub = this.eventService.userChange$.subscribe(userName => {
      this.isLoggedIn = true;
      this.updateRides();
      userChangeSub.unsubscribe();
    });
  }

  ngOnInit() {
  }

  selectFavoriteRides() {
    const dialogRef = this.dialog.open(FavoriteRidesSelectorComponent, {
      width: '400px',
      data: this.totalRides
    });

    dialogRef.afterClosed().subscribe(result => {
      this.totalRides = [];
      this.favoriteRides = [];
      this.updateRides();
    });
  }

  private updateRides() {
    const getFavoriteRidesSub = this.serverAPIService.getFavoriteRides().subscribe((res: FavoriteRidesResponse) => {
      this.favoriteRides = res.favoriteRides;
      this.eventService.favoriteRidesObtained(res.favoriteRides);
      const getParksSub = this.serverAPIService.getParks().subscribe(parksRes => {
        const keys = Object.keys(parksRes.body);
        for (const key of keys) {
          const parkRides = parksRes.body[key].rides;
          for (const ride of parkRides) {
            let favoriteRide = false;
            if (this.favoriteRides.indexOf(ride.rideName) > -1) {
              favoriteRide = true;
            }
            this.totalRides.push({
              rideName: ride.rideName,
              isFavoriteRide: favoriteRide
            });
          }
          getFavoriteRidesSub.unsubscribe();
          getParksSub.unsubscribe();
        }
      });
    });
  }
}
