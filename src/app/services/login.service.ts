import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
   signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth : Auth) { }

  register({email, password}: any){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  login({email, password}: any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  logout(){
    return signOut(this.auth);
  }
  loginGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  loginFacebook(){
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }
}
