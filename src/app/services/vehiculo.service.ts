import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Vehiculo } from '../models/vehiculo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  constructor(private db: AngularFirestore) { }

  async addVehiculo(vehiculo: Vehiculo){
    vehiculo.id = this.db.createId()
    await this.db.collection('vehiculos').doc(vehiculo.id).set(vehiculo)
    return vehiculo.id;
  }
  deleteVehiculo(id: string){
    return this.db.collection('vehiculos').doc(id).delete();
  }
  updateVehiculo(vehiculo: Vehiculo){
    return this.db.collection('vehiculos').doc(vehiculo.id).update(vehiculo);
  }
  getVehiculos() : Observable<Vehiculo[]>{
    return this.db.collection('vehiculos').valueChanges() as Observable<Vehiculo[]>;
  }
  getVehiculo(id: string) : Observable<Vehiculo>{
    return this.db.collection('vehiculos').doc(id).valueChanges() as Observable<Vehiculo>;
  } 
}
