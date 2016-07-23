import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  message: string;

  constructor(private navCtrl: NavController) {

  }

  ngOnInit() {
    console.log("init");
    
    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      this.message = "starting to create table";
      db.executeSql('create table IF NOT EXISTS danceMoves(name VARCHAR(32))', {}).then(() => {
        console.log("table created");
        this.message = "table created";
      }, (err) => {
        console.error('Unable to execute sql', JSON.stringify(err));
        this.message = 'Unable to execute sql', JSON.stringify(err);
      })
    }, (err) => {
      console.error('Unable to open database', err);
      this.message = 'Unable to open database';
    });
  }
}
