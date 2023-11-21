import { Component } from '@angular/core';
import { Vehiculo } from 'src/app/models/vehiculo';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-list-car',
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.scss']
})
export class ListCarComponent {
  vehiculos : Vehiculo[] = [];
  car: Vehiculo = new Vehiculo()
  rol = localStorage.getItem('rol');
  constructor(
    private vehiculoService: VehiculoService,
    public dialog: MatDialog
  ){}
  ngOnInit(){
    this.vehiculoService.getVehiculos().subscribe((vehiculos) => {
      this.vehiculos = vehiculos;
      if(vehiculos.length > 0){
        this.car = vehiculos[0];
      }
    })
  }

  changeSlide(event: any){
    this.car = this.vehiculos[event.to];
  }

  deleteVehiculo(){
    this.dialog.open(DeleteDialogComponent, {
      width: '500px'
    }).afterClosed().subscribe((response) => {
      if (response) {
        this.vehiculoService.deleteVehiculo(this.car.id);
      }
    })
  }
}
