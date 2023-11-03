import { Injectable } from '@angular/core';
import { Testimonio } from '../models/testimonio';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestimonioService {
  constructor(private db: AngularFirestore) { }

  async addTestimonio(testimonio: Testimonio){
    testimonio.id = this.db.createId()
    await this.db.collection('testimonios').doc(testimonio.id).set(testimonio)
    return testimonio.id;
  }
  deleteTestimonio(id: string){
    return this.db.collection('testimonios').doc(id).delete();
  }
  updateTestimonio(testimonio: Testimonio){
    return this.db.collection('testimonios').doc(testimonio.id).update(testimonio);
  }
  getTestimonios() : Observable<Testimonio[]>{
    return this.db.collection('testimonios').valueChanges() as Observable<Testimonio[]>;
  }
  getTestimonio(id: string) : Observable<Testimonio>{
    return this.db.collection('testimonios').doc(id).valueChanges() as Observable<Testimonio>;
  } 
}
