import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, LoadingController } from 'ionic-angular';

import { BLE } from '@ionic-native/ble';
/**
 * Generated class for the BluetoothPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  devices: any;
  notifications: any;

  constructor( public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private ble: BLE, public loadingCtrl: LoadingController) {
    this.devices = [{'name':'First device','id':'3D:02:32:14:45:82s'}];
    this.notifications = [];
    this.platform.ready().then(() => {
      console.log("started scanning");
      ble.scan([], 60).subscribe(
          device => {
            //console.log("Found device: " + JSON.stringify(device));
            this.devices.push(device);
            console.log(this.devices);

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
    });

  }

  testConnection(device){
    console.log(this.ble.isConnected(device.id));
  }
  selectConnect(device){

    this.ble.connect(device.id).subscribe(
     peripheralData => {
       //this.notifications = ["first notification!"];
       console.log("Connect:" + JSON.stringify(peripheralData));
         this.ble.startNotification(device.id, '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e').subscribe(function (notificationData){
           console.log("Notification:"+ String.fromCharCode.apply(null, new Uint8Array(notificationData)));
           this.notifications = [];
           this.notifications.push(String.fromCharCode.apply(null, new Uint8Array(notificationData)));
           console.log(this.notifications);
           this.ble.read(device.id, '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e').then(function (data){
             //console.log("READ:" + String.fromCharCode.apply(null, new Uint8Array(data)));
             console.log ("Read" + JSON.stringify(data));
           }, function(error) {
             console.log("Error Read" + JSON.stringify(error));
           });
         }, function(error){
           console.log("Error Notification" + JSON.stringify(error));
         });
       },
   error => console.log("Error Connecting" + JSON.stringify(error))
   );




      /*console.log("Connecting to " + device.name + "...");
      this.ble.connect(device.id);
      let loader = this.loadingCtrl.create({
        content: "Connecting to Bluetooth...",
        duration: 3000
      });
    loader.present();*/
    //console.log("Connected!");
      /*while(!this.ble.isConnected(device.id)){
        console.log("Still connecting...");
      }
      console.log("Done! Now connected to:" + device.name + "!");*/

  }
  connectSuccess(){
    console.log("Successfully connected!");
  }
  connectFailure(){
    console.log("Error. Could not connect to bluetooth device.");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BluetoothPage');
  }

}
