// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'silverbook-faculty-webapp';
  public static loggedIn: boolean = false;
  public static email: string = ' ';
  constructor() {}
  ngOnInit() {}
}
