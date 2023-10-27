import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehiculo } from 'src/app/models/vehiculo';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss']
})
export class AddEditCarComponent {
  form !: FormGroup;
  action: string = "Registrar"
  id!: string;
  constructor(private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    this.id = this.route.snapshot.params["id"]
    this.form = this.fb.group({
      id: "",
      marca: ["", Validators.required],
      modelo: ["", Validators.required],
      anio: ["", [Validators.required, Validators.min(1900)]],
      color: ["", Validators.required],
      placa: ["", Validators.required],
      moneda: ["", Validators.required],
      precio: ["", [Validators.required, Validators.min(15000)]],
      foto: ["", Validators.required],
      inicial : ['', [Validators.required, Validators.min(15), Validators.max(25)]],
      descuento: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
    })
    if (this.id != null) {
      this.vehiculoService.getVehiculo(this.id).subscribe((vehiculo: Vehiculo) => {
        this.form = this.fb.group({
          id: vehiculo.id,
          marca: [vehiculo.marca, Validators.required],
          modelo: [vehiculo.modelo, Validators.required],
          anio: [vehiculo.anio, [Validators.required, Validators.min(1900)]],
          color: [vehiculo.color, Validators.required],
          placa: [vehiculo.placa, Validators.required],
          moneda: [vehiculo.moneda, Validators.required],
          precio: [vehiculo.precio, [Validators.required, Validators.min(15000)]],
          foto: [vehiculo.foto, Validators.required],
          inicial : [vehiculo.inicial, [Validators.required, Validators.min(15), Validators.max(25)]],
          descuento: [vehiculo.descuento, [Validators.required, Validators.min(0), Validators.max(100)]]
        })
        this.action = "Actualizar"
      })
    }
  }
  addEditVehiculo() {
    if (this.id) {
      this.vehiculoService.updateVehiculo(this.form.value).then(() =>
        this.router.navigateByUrl('/cars')
      )
    } else {
      this.vehiculoService.addVehiculo(this.form.value).then(() =>
        this.router.navigateByUrl('/cars')
      )
    }
  }

}


