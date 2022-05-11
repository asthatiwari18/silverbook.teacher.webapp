import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  private userList = new Map([
    ["DABB@iiita.ac.in", "IIITA123"],
    ["iit2018052@iiita.ac.in", "IIITA123"],
    ["iit2018199@iiita.ac.in", "IIITA123"]
  ]);
  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  signInHandler(): void {
    if(this.userList.has(this.email)&&this.userList.get(this.email)===this.password){
      var data : Object ={}
      data['email']=this.email;
      localStorage.setItem('google_auth', JSON.stringify(data));
      this.router.navigateByUrl('/qr-generator').then();
    }
    else{
      AppComponent.loggedIn=false;
      AppComponent.email= " ";
      var errorDiv = document.getElementById('badCredentials');
      errorDiv.innerHTML = '<h3>Bad Credentials</h3>';
    }
    
  }

}
