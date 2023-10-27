import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  nombre = '';
  constructor(private auth: AngularFireAuth) { }
  ngOnInit() {
    this.auth.currentUser.then((response) => this.nombre = response?.displayName as string);
  }
}
