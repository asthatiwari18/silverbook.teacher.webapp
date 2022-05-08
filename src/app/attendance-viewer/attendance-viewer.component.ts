import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance-viewer',
  templateUrl: './attendance-viewer.component.html',
  styleUrls: ['./attendance-viewer.component.css'],
})
export class AttendenceViewerComponent implements OnInit {
  firstFormGroup: FormGroup;
  collegeFormGroup: FormGroup;
  branchFormGroup: FormGroup;
  semFormGroup: FormGroup;
  public attendanceData: Object[];
  public displayedColumns: String[];
  public dataSource: MatTableDataSource<Object>;

  public subject: string = null;
  public college: string = null;
  public branch: string = null;
  public faculty: string =null;
  public semester: string = null;
  public isShowTable: boolean = false;
  private backendurl: string = 'https://mysterious-wave-81851.herokuapp.com';
  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.dataSource = new MatTableDataSource();
    
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('google_auth');
    if (storage) {
      var data = JSON.parse(storage);
      this.faculty = data['email'].replace("@iiita.ac.in","");
    } else {
      this.signOut();
    }
    this.firstFormGroup = this._formBuilder.group({
      subCtrl: ['', Validators.required],
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
  }

  prepareData(attFromDB: Object) {
    this.attendanceData = [];
    this.displayedColumns = [];
    const students = Object.keys(attFromDB);

    students.forEach((student, studentInd) => {
      var studInfo: Object = {};
      studInfo['Roll no'] = student;
      const dates = Object.keys(attFromDB[student]);
      var absentCount =0
      var presentCount= 0
      studInfo["Attendance Percentage"]=0
      dates.forEach((date, dateInd) => {
        studInfo[date] = attFromDB[student][date]['status'];
        if(studInfo[date]==='A')absentCount+=1;
        else presentCount+=1
      });
      studInfo["Attendance Percentage"]=Math.floor((presentCount*100)/(presentCount+absentCount))
      this.attendanceData.push(studInfo);
    });
    console.log(this.attendanceData);
    for (let v in this.attendanceData[0]) {
      this.displayedColumns.push(v);
    }
    this.dataSource = new MatTableDataSource<Object>(this.attendanceData);
  }

  fetchDataFromDB() {

    this.http
      .get(this.backendurl + '/faculty/attendance', {
        params: {
          semester: this.semester,
          faculty: this.faculty,
          branch: this.branch,
          college: this.college,
          subject: this.subject,
        },
        observe: 'response',
      })
      .toPromise()
      .then(
        (response) => {
          this.prepareData(response.body);
          this.isShowTable = true;
        },
        (error) => {
          this.showError(error);
        }
      )
      .catch(this.showError);
  }

  showError(response: any) {
    this.isShowTable = false;
    console.log(response.error);
    var errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '<h3>' + response.error + '</h3>';
  }
  deleteError() {
    var errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '';
  }
  viewAttendance() {
    this.deleteError();
    this.fetchDataFromDB();
  }
  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/login').then();
  }
}
