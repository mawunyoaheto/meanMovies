import { AppService, AlertModel } from './app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-movies-ui';

  alertConfirm!: AlertModel;
  constructor(private appService: AppService) {
    appService.alert.subscribe((alert) => {
      this.alertConfirm  = alert;
    })
  }
}
