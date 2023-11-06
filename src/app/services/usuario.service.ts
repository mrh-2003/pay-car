import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../models/usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private db: AngularFirestore,  private auth: AngularFireAuth) { }

  addUsuario(usuario: Usuario){
    return this.db.collection('usuarios').doc(usuario.id).set(usuario);
  }
  getUsuario(id: string) : Observable<Usuario>{
    return this.db.collection('usuarios').doc(id).valueChanges() as Observable<Usuario>;
  } 
  async getRol(){
    let rol: string = '';
    await this.auth.currentUser.then((response) => {
      this.getUsuario(response?.uid as string).subscribe(usuario => {
        rol = usuario.rol;
      } )
    });
    return rol;
  }
}
