import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-close-dialog',
  templateUrl: './close-dialog.component.html',
  styleUrls: ['./close-dialog.component.scss']
})
export class CloseDialogComponent {

  constructor(private login : LoginService ,
    private router: Router) {}
  logout(){
    this.login.logout()
    .then((response) => {
      this.router.navigate(["/login"])
    })
  }
}
