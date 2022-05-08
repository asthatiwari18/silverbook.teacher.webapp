import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

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
  public semester: string = null;
  public isShowTable: boolean = false;
  private backendurl: string = 'https://mysterious-wave-81851.herokuapp.com';
  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
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
      studInfo['name'] = student;
      const dates = Object.keys(attFromDB[student]);
      dates.forEach((date, dateInd) => {
        studInfo[date] = attFromDB[student][date]['status'];
      });
      this.attendanceData.push(studInfo);
    });
    console.log(this.attendanceData);
    for (let v in this.attendanceData[0]) {
      this.displayedColumns.push(v);
    }
    this.dataSource = new MatTableDataSource<Object>(this.attendanceData);
  }

  fetchDataFromDB() {
    // // console.log("start",Date.now())
    // let body = new URLSearchParams();
    // body.set('college', this.college);
    // body.set('branch', this.branch);
    // body.set('faculty', 'DABB');
    // body.set('subject', this.subject);
    // body.set('semester', this.semester);

    this.http
      .get(this.backendurl + '/faculty/attendance', {
        params: {
          semester: this.semester,
          faculty: 'DABB',
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
          console.log('beforeIsShow');
          this.isShowTable = true;
          console.log('afterIsShow');
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
}
