import {Component, Input, ViewChild, NgZone, OnInit, OnDestroy} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { ParkApiService } from '../park-api.service';
import { Ride } from '../ride';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild(AgmMap) map: AgmMap;
  lat: number;
  lng: number;
  zoom: number;
  rides: Ride[] = [];
  ridesSubscription: Subscription;
  constructor(public mapsApiLoader: MapsAPILoader, private rideApiService: ParkApiService) { }

  ngOnInit() {
    // Load map and center it on theme park
    this.mapsApiLoader.load().then(() => {
      this.lat = 28.355811;
      this.lng = -81.5637406;
      this.zoom = 18;
    });

    // Get list of rides from server
    this.ridesSubscription = this.rideApiService.getParks().subscribe(res => {
      const keys = Object.keys(res.body);
      for (const key of keys) {
        const parkRides = res.body[key].rides;
        for (const ride of parkRides) {
          this.rides.push(ride);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.ridesSubscription) {
      this.ridesSubscription.unsubscribe();
    }
  }
}
