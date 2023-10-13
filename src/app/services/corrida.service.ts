import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Corrida } from '../models/corrida';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CorridaService {

  constructor(private db: AngularFirestore) { }

  addCorrida(corrida: Corrida){
    return this.db.collection('corridas').add(corrida);
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
  getCorrida(id: string){
    return this.db.collection('corridas').doc(id).valueChanges();
  }
}
