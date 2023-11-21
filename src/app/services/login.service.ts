import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
   signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth : Auth) { }

  register({email, password}: any){
    localStorage.setItem('rol', 'client');
    localStorage.setItem('index', '1');
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  login({email, password}: any){
    localStorage.setItem('rol', 'client');
    localStorage.setItem('index', '1');
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  logout(){
    localStorage.clear();
    return signOut(this.auth);
  }
  loginGoogle(){
    localStorage.setItem('rol', 'client');
    localStorage.setItem('index', '1');
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  loginFacebook(){
    localStorage.setItem('rol', 'client');
    localStorage.setItem('index', '1');
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }
}
