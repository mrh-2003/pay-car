import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Banco } from '../models/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(private db: AngularFirestore) { }

  addBanco(banco: Banco){
    return this.db.collection('bancos').add(banco);
  }
  deleteBanco(id: string){
    return this.db.collection('bancos').doc(id).delete();
  }
  updateBanco(banco: Banco){
    return this.db.collection('bancos').doc(banco.id).update(banco);
  }
  getBancos(){
    return this.db.collection('bancos').valueChanges();
  }
  getBanco(id: string){
    return this.db.collection('bancos').doc(id).valueChanges();
  } 
}
