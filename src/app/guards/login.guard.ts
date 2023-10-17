import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.authState.pipe(
      map((user) => {
        if (user) {
          return this.router.parseUrl('/home');
        } else {
          return true;
        }
      })
    );
}
  
}
