import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Corrida } from '../models/corrida';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CorridaService {

  constructor(private db: AngularFirestore) { }

  async addCorrida(corrida: Corrida){
    corrida.id = this.db.createId()
    await this.db.collection('corridas').doc(corrida.id).set(corrida)
    return corrida.id;
  }
  deleteCorrida(id: string){
    return this.db.collection('corridas').doc(id).delete();
  }
  updateCorrida(corrida: Corrida){
    return this.db.collection('corridas').doc(corrida.id).update(corrida);
  }
  getCorridas() : Observable<Corrida[]>{
    return this.db.collection('corridas').valueChanges() as Observable<Corrida[]>;
  }
  getCorrida(id: string) : Observable<Corrida>{
    return this.db.collection('corridas').doc(id).valueChanges() as Observable<Corrida>;
  }
  getCorridasByUserID(userId: string): Observable<Corrida[]> {
    return this.db.collection('corridas', ref => ref.where('idUsuario', '==', userId))
      .valueChanges() as Observable<Corrida[]>;
  }
}
