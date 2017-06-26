import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
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

  constructor( public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private bs: BluetoothSerial) {
    this.platform.ready().then(() => {
      bs.isConnected()
        .then(() => {
          console.log('is connected');
        }, (err) => {
          console.log(' not connected')
        })
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad BluetoothPage');
  }

}
