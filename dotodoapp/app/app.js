//Jayaweera W.A.H.M. Dinuka T Jayaweera
import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {DBService} from './service/dbservice';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [DBService],
  config: {}
})
export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.rootPage = HomePage;

    platform.ready().then(() => {
      // Here can do any higher level native things we might need.
      StatusBar.styleDefault();
    });
  }
}
