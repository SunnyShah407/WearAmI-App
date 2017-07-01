import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { BLE } from '@ionic-native/ble';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
declare var google;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
//import { Component, ViewChild, ElementRef } from '@angular/core';
//import { NavController } from 'ionic-angular';



export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  coords: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private ble: BLE) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }

  addMarker(){
      //this.coords = [];
      this.ble.scan([], 60).subscribe(
          device => {
            //console.log("Found device: " + JSON.stringify(device));
            //this.devices.push(device);
            //console.log(this.devices);

            this.ble.connect('EF:9F:EE:BE:A8:42').subscribe(
             peripheralData => {
               //this.notifications = ["first notification!"];
               console.log("Connect:" + JSON.stringify(peripheralData));
                 this.ble.startNotification('EF:9F:EE:BE:A8:42', '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e').subscribe(function (notificationData){
                   console.log("Notification:"+ String.fromCharCode.apply(null, new Uint8Array(notificationData)));
                   this.notifications = [];
                   this.notifications.push(String.fromCharCode.apply(null, new Uint8Array(notificationData)));
                   console.log(this.notifications);
                   this.ble.read('EF:9F:EE:BE:A8:42', '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e').then(function (data){
                     //console.log("READ:" + String.fromCharCode.apply(null, new Uint8Array(data)));
                     console.log("Read" + JSON.stringify(data));

                     let marker = new google.maps.Marker({
                       map: this.map,
                       animation: google.maps.Animation.DROP,
                       position: new google.maps.LatLng(42.35587,-71.09828)
                     });

                     let content = "<h4>Information!</h4>";

                     this.addInfoWindow(marker, content);

                   }, function(error) {
                     console.log("Error Read" + JSON.stringify(error));
                   });
                 }, function(error){
                   console.log("Error Notification" + JSON.stringify(error));
                 });
               },
           error => console.log("Error Connecting" + JSON.stringify(error))
           );
          },
          err => {
            console.log("Error occurred during this.ble scan: " + JSON.stringify(err));
          },
          () => {
            console.log("End of devices...");
          }
        );

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

}
