// app.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-qr-code-tutorial';

  public qrdata: string = null;
  public level: 'L' | 'M' | 'Q' | 'H';
  public width: number;
  private backendurl: string = 'http://localhost:3000';
  //https://afternoon-earth-49751.herokuapp.com
  isLinear = true;
  isShow = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  collegeFormGroup: FormGroup;
  branchFormGroup: FormGroup;
  semFormGroup: FormGroup;
  classNoFormGroup: FormGroup;

  public qrcode: string = null;
  public subject: string = null;
  public college: string = null;
  public branch: string = null;
  public semester: string = null;
  public date: string = null;
  public myInterval = null;
  public classNumber: string = null;
  public otp: string = null;
  public qrData = {
    college: 'IIITA',
    subject: 'LAL',
    date: '2022-08-12',
    classNumber: '2',
    otp: '123',
    qrGenTime: 10000,
  };
  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
    this.level = 'H';
    this.qrcode = '';
    this.width = 256;
  }
  ngOnInit() {
    let r = Math.floor(Math.random() * 10000);
    this.qrData['otp'] = r.toString();
    this.firstFormGroup = this._formBuilder.group({
      subCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      dateCtrl: ['', Validators.required],
    });
    this.collegeFormGroup = this._formBuilder.group({
      collegeCtrl: ['', Validators.required],
    });
    this.branchFormGroup = this._formBuilder.group({
      branchCtrl: ['', Validators.required],
    });
    this.semFormGroup = this._formBuilder.group({
      semCtrl: ['', Validators.required],
    });
    this.classNoFormGroup = this._formBuilder.group({
      classNoCtrl: ['', Validators.required],
    });
  }

  changeOTP() {
    let r = Math.floor(Math.random() * 10000);
    this.qrData['otp'] = r.toString();
    this.otp= r.toString();


    const d = new Date();
    this.qrData['qrGenTime'] = d.getTime();
    this.qrcode = JSON.stringify(this.qrData);
    let body = new URLSearchParams();
    body.set('college', this.college);
    body.set('branch', this.branch);
    body.set('faculty', 'DABB');
    body.set('date', this.date.toString());
    body.set('classCount', this.classNumber);
    body.set('subject', this.subject);
    body.set('semester', this.semester);
    console.log("body = ",body)
    let head = new HttpHeaders();

    let options = {
      headers: new HttpHeaders().set('QROTP', this.otp)
      .set('Content-Type', 'application/x-www-form-urlencoded')

      .set('responseType', 'text')
      .set('Accept', 'text/plain')
      , responseType: 'text' as 'json'
    };

    this.http.put<String>('http://localhost:4000/faculty/qr',body.toString(),options)
    .subscribe(response=>{
      console.log(response, body.toString())
    })

    console.log(this.qrData);
  }

  everyTime() {
    document.getElementById('submit').click();

  }

  changeQrdata() {
    this.qrData['subject'] = this.subject;
    this.qrData['college'] = this.college;
    this.qrData['date'] = this.date;
    this.qrData['classNumber'] = this.classNumber;
    let r = Math.floor(Math.random() * 10000);
    this.qrData['otp'] = r.toString();
    this.otp = r.toString();
    const d = new Date();
    this.qrData['qrGenTime'] = d.getTime();
    this.qrcode = JSON.stringify(this.qrData);
    this.isShow = true;
    this.myInterval = setInterval(this.everyTime, 5000);
  }

  deleteQR() {
    this.isShow = false;
    clearInterval(this.myInterval);
  }
}
