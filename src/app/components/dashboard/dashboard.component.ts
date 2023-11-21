import { CloseDialogComponent } from './../close-dialog/close-dialog.component';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  activeButton: number = parseInt(localStorage.getItem('index') as string); // Inicializas la variable para el botón activo
  rol = localStorage.getItem('rol');
  setActiveButton(index: number) {
    localStorage.setItem('index', index.toString());
    this.activeButton = index;
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver,
     public dialog: MatDialog) {}
  openDialog(): void {
    this.setActiveButton(7)
    this.dialog.open(CloseDialogComponent, {
      width: '500px' });
  }

}
