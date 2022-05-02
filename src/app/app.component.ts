// app.component.ts
import { Component, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
 import $ from "jquery";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'angular-qr-code-tutorial';

  public qrdata: string = null;
  public level: "L" | "M" | "Q" | "H";
  public width: number;
  isLinear = true;
  isShow= false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  public qrcode: string = null
  public subject: string = null
  public qrData = [{
    'subject': 'LAL',
    'date': '2016-01-01',
    'classNumber': '2',
    'secret': '123'
  }]
  constructor(private _formBuilder: FormBuilder) {
    this.level = "H";
    this.qrcode ="";
    this.width = 256;
     
  }
    ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }


  async everyTime ()  {
  this.isShow=false;
  let r= Math.floor(Math.random() * 10000);
  this.qrcode= r.toString();
  console.log("random no", this.qrcode);
   document.getElementById("submit").click(); 
  // this._cdr.detectChanges()
  this.isShow=true;
 
  
}

 changeQrdata(newValue: string) {
    this.qrcode = newValue;
    this.isShow= true;
    var myInterval = setInterval(this.everyTime, 5000);
  }

  deleteQR(){
    this.isShow= false;
  }

}