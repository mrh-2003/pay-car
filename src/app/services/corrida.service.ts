import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Corrida } from '../models/corrida';
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
  getCorridas(){
    return this.db.collection('corridas').valueChanges();
  }
  getCorrida(id: string){
    return this.db.collection('corridas').doc(id).valueChanges();
  }
}
