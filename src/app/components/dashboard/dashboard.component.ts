import { CloseDialogComponent } from './../close-dialog/close-dialog.component';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, async } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  rol = '';
  constructor(private breakpointObserver: BreakpointObserver,
     public dialog: MatDialog,
     private usuarioService: UsuarioService) {}
  openDialog(): void {
    this.dialog.open(CloseDialogComponent, {
      width: '500px' });
  }
  ngOnInit(){
   this.usuarioService.getRol().then(rol=> this.rol = rol);
    console.log(this.rol);
  }

}
