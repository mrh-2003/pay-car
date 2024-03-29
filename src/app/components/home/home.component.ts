import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Testimonio } from 'src/app/models/testimonio';
import { TestimonioService } from 'src/app/services/testimonio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  nombre = '';
  email = '';
  comentario = '';
  testimonios: Testimonio[] = [];
  today = new Date();
  constructor(private auth: AngularFireAuth, private testimonioService: TestimonioService) { }
  ngOnInit() {
    this.auth.currentUser.then((response) => {
      this.nombre = response?.displayName as string
      this.email = response?.email as string
    });
    this.testimonioService.getTestimonios().subscribe((data: Testimonio[]) => this.testimonios = data);
  }

  addTestimonio() {
    const persona : Testimonio = {
      id : '',
      nombre: this.nombre,
      comentario: this.comentario,
      fecha: new Date().toISOString(),
      email: this.email
    }
    this.testimonioService.addTestimonio(persona).then((data: any) => {
      this.comentario = '';
    })
  }
}
