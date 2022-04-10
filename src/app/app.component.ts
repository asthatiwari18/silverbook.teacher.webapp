// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-qr-code-tutorial';

  public qrdata: string = null;
  public level: "L" | "M" | "Q" | "H";
  public width: number;
  public qrcode: string = null
  public subject: string = null
  public data = [{
    'subject': 'LAL',
    'date': '2016-01-01',
    'classNumber': '2',
    'secret': '123'
  }]
  constructor() {
    this.level = "H";
    this.qrcode = JSON.stringify(this.data)
    this.width = 256;
  }


  changeQrdata(newValue: string): void {
    this.qrcode = newValue+"123";
  }

}