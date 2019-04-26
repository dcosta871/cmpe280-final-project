import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { ParkApiService } from '../park-api.service';
import { Subscription } from 'rxjs';
import { EventService } from '../event.service';

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
  public mapStyles = [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ];
  visibleRides = [];
  totalRides = [];
  parksSubscription: Subscription;
  eventServiceSubscription: Subscription;
  constructor(public mapsApiLoader: MapsAPILoader, private parkApiService: ParkApiService, private eventService: EventService) { }

  ngOnInit() {
    // Load map and center it on theme park
    this.mapsApiLoader.load().then(() => {
      this.lat = 28.355811;
      this.lng = -81.5637406;
      this.zoom = 18;
    });

    // Get list of rides from server
    this.parksSubscription = this.parkApiService.getParks().subscribe(res => {
      const keys = Object.keys(res.body);
      for (const key of keys) {
        const parkRides = res.body[key].rides;
        const rideParkName = res.body[key].parkName;
        for (const ride of parkRides) {
          this.totalRides.push({
            rideName: ride.rideName,
            lat: ride.lat,
            lng: ride.lng,
            parkName: rideParkName
          });
          this.visibleRides.push(ride);
        }
      }
    });

    this.eventServiceSubscription = this.eventService.parkFilter$.subscribe(parkFilter => {
      this.visibleRides = [];
      for (const ride of this.totalRides) {
        if (ride.parkName === parkFilter || parkFilter === 'All Parks') {
          this.visibleRides.push(ride);
        }
      }
    });

    this.eventServiceSubscription = this.eventService.rideChange$.subscribe(rideChange => {
      if (rideChange.adjust) {
        for (const ride of this.visibleRides) {
          if (ride.rideName === rideChange.ride) {
            this.lat = ride.lat;
            this.lng = ride.lng;
          }
        }
      }
    });
  }

  handleRideClick(ride) {
    this.eventService.rideChange(ride.rideName, false);
  }

  ngOnDestroy() {
    if (this.parksSubscription) {
      this.parksSubscription.unsubscribe();
    }
  }
}
