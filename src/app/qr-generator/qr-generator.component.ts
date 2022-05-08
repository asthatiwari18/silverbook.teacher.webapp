import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.css'],
})
export class QrGeneratorComponent {
  title = 'silverbook-qr-generator';

  public qrdata: string = null;
  public level: 'L' | 'M' | 'Q' | 'H';
  public width: number;
  private backendurl: string = 'https://afternoon-earth-49751.herokuapp.com';
  isLinear = true;
  isShowQR = false;
  isShowError = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  collegeFormGroup: FormGroup;
  branchFormGroup: FormGroup;
  semFormGroup: FormGroup;
  classNoFormGroup: FormGroup;

  public errorOccured: boolean = false;
  public qrcode: string = null;
  public subject: string = null;
  public college: string = null;
  public branch: string = null;
  public semester: string = null;
  public date: string = null;
  public myInterval = null;
  public timeOut : number= 5000;
  public classNumber: string = null;
  public otp: string = null;
  public qrData = {
    college: 'IIITA',
    subject: 'LAL',
    date: '2022-08-12',
    classNumber: '2',
    otp: '123',
    qrTimeout: 10000,
  };
  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
    this.level = 'H';
    this.qrcode = '';
    this.width = 256;
  }
  ngOnInit() {
    
    this.qrData['otp'] = this.generateOTP();
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

  showError(response: any) {
    this.isShowQR = false;
    this.isShowError = true;
    this.errorOccured = true;
    clearInterval(this.myInterval);
    console.log(response.error);
    var errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '<h3>' + response.error + '</h3>';
  }

  deleteError() {
    this.errorOccured = false;
    var errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '';
  }

  updateOTPInDB() {
    let body = new URLSearchParams();
    body.set('college', this.college);
    body.set('branch', this.branch);
    body.set('faculty', 'DABB');
    body.set('date', formatDate(this.date, 'dd-MM-yyyy', 'en-US'));
    body.set('classCount', this.classNumber);
    body.set('subject', this.subject);
    body.set('semester', this.semester);

    let options = {
      headers: new HttpHeaders()
        .set('QROTP', this.otp)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'text/plain'),
      responseType: 'text' as 'json',
    };

    this.http
      .put<string>(this.backendurl + '/faculty/qr', body.toString(), options)
      .subscribe(
        (response) => {
          if (response !== 'QR Updated') {
            this.showError(response);
          }
          // console.log("end",Date.now())
        },
        (error) => {
          this.showError(error);
        }
      );
  }
  // Function to generate OTP
  generateOTP() {
    // Declare a string variable
    // which stores all string
    var string =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let OTP = '';

    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 15; i++) {
      OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
  }

  changeOTP() {
    this.otp = this.generateOTP();
    this.qrData['otp'] = this.otp;
    this.updateOTPInDB();
    const d = new Date();
    this.qrData['qrTimeout'] = d.getTime()+this.timeOut;
    this.qrcode = JSON.stringify(this.qrData);
    console.log(this.qrData);
  }

  everyTime() {
    document.getElementById('submit').click();
  }

  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  changeQrdata() {
    this.deleteError();
    this.qrData['subject'] = this.subject;
    this.qrData['college'] = this.college;
    this.qrData['date'] = formatDate(this.date, 'dd-MM-yyyy', 'en-US');
    this.qrData['classNumber'] = this.classNumber;
    let r = Math.floor(Math.random() * 10000);
    this.qrData['otp'] = r.toString();
    this.otp = r.toString();
    const d = new Date();
    this.qrData['qrTimeout'] = d.getTime()+this.timeOut;
    this.qrcode = JSON.stringify(this.qrData);
    this.updateOTPInDB();
    this.sleep(1000);
    if (!this.errorOccured) {
      this.isShowQR = true;
      this.myInterval = setInterval(this.everyTime, this.timeOut);
    }
  }

  deleteQR() {
    this.deleteError();
    this.isShowQR = false;
    this.isShowError = false;
    console.log('deleted QR');
    this.everyTime();
    clearInterval(this.myInterval);
  }
}
