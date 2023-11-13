import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Banco } from '../models/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(private db: AngularFirestore) { }

  addBanco(banco: Banco){
    banco.id = this.db.createId()
    return this.db.collection('bancos').doc(banco.id).set(banco);
  } 
  deleteBanco(id: string){
    return this.db.collection('bancos').doc(id).delete();
  }
  updateBanco(banco: Banco){
    return this.db.collection('bancos').doc(banco.id).update(banco);
  }
  getBancos(): Observable<Banco[]>{    
    return this.db.collection('bancos').valueChanges() as Observable<Banco[]>;
  }
  getBanco(id: string) : Observable<Banco>{
    return this.db.collection('bancos').doc(id).valueChanges() as Observable<Banco>;
  }
  getBancoByName(name: string): Observable<Banco[]> {
    return this.db.collection('bancos', ref => ref.where('nombre', '==', name))
      .valueChanges() as Observable<Banco[]>;
  }
}
