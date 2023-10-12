import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoGracia } from '../models/periodoGracia';
@Injectable({
  providedIn: 'root'
})
export class PeriodoGraciaService {

  constructor(private db: AngularFirestore) { }
  addPeriodo(periodo: PeriodoGracia){
    return this.db.collection('periodos').add(periodo);
  }
  deletePeriodo(id: string){
    return this.db.collection('periodos').doc(id).delete();
  }
  updatePeriodo(periodo: PeriodoGracia){
    return this.db.collection('periodos').doc(periodo.id).update(periodo);
  }
  getPeriodos(){
    return this.db.collection('periodos').valueChanges();
  }
  getPeriodo(id: string){
    return this.db.collection('periodos').doc(id).valueChanges();
  }
}
