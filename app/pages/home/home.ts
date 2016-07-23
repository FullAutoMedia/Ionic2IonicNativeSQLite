import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private database: SQLite;
  moves: Array<{ id: number, name: string }> = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.database = new SQLite();
    this.database.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      this.database.executeSql('drop table danceMoves', []).then(() => {
        this.database.executeSql('create table IF NOT EXISTS danceMoves(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32))', {}).then(() => {
            this.refresh();
          }, (err) => {
            console.log('Unable to execute sql err:' + JSON.stringify(err));
          })
        }, (err) => {
          console.log('Unable to opendb err:' + JSON.stringify(err));
        });
      });
  }

  public onAddClick(name: string) {
    this.database.executeSql("INSERT INTO danceMoves(name) VALUES (?)", [name]).then(() => {
      this.refresh();
    });
  }

  public onDeleteClick(id: number) {
    this.database.executeSql("DELETE FROM danceMoves WHERE id=?", [id]).then(() => {
      this.refresh();
    });
  }

  public refresh() {
    this.database.executeSql("SELECT * FROM danceMoves", []).then((data) => {
      this.moves = [];
      for(let i = 0; i < data.rows.length; i++) {
        this.moves.push({id: data.rows.item(i).id, name: data.rows.item(i).name});
      }
    });
  }
}
