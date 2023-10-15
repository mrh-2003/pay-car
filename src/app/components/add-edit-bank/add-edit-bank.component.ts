import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Banco } from 'src/app/models/banco';
import { BancoService } from 'src/app/services/banco.service';

@Component({
  selector: 'app-add-edit-bank',
  templateUrl: './add-edit-bank.component.html',
  styleUrls: ['./add-edit-bank.component.scss']
})
export class AddEditBankComponent {
  form !: FormGroup;
  action: string = "Registrar"
  id!: string;
  constructor(private fb: FormBuilder, 
    private bancoService: BancoService, 
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    this.id = this.route.snapshot.params["id"]
    this.form = this.fb.group({
      id: "",
      nombre: ['', Validators.required],
      cosNotariales: ['', Validators.required],
      cosRegistrales: ['', Validators.required],
      tasacion: ['', Validators.required],
      comEstudio: ['', Validators.required],
      comActivacion: ['', Validators.required],
      comPeriodica: ['', Validators.required],
      portes: ['', Validators.required],
      gastosAdmin: ['', Validators.required],
      segDesgravamen: ['', Validators.required],
      segRiesgo: ['', Validators.required],
    })
    if (this.id != null) {
      this.bancoService.getBanco(this.id).subscribe((banco: Banco) => {
        this.form = this.fb.group({
          id: banco.id,
          nombre: [banco.nombre, Validators.required],
          cosNotariales: [banco.cosNotariales, Validators.required],
          cosRegistrales: [banco.cosRegistrales, Validators.required],
          tasacion: [banco.tasacion, Validators.required],
          comEstudio: [banco.comEstudio, Validators.required],
          comActivacion: [banco.comActivacion, Validators.required],
          comPeriodica: [banco.comPeriodica, Validators.required],
          portes: [banco.portes, Validators.required],
          gastosAdmin: [banco.gastosAdmin, Validators.required],
          segDesgravamen: [banco.segDesgravamen, Validators.required],
          segRiesgo: [banco.segRiesgo, Validators.required],
        })
        this.action = "Actualizar"
      })
    }
  }

  addEditBank() {
    this.form.value.segDesgravamen = this.form.value.segDesgravamen / 100;
    this.form.value.segRiesgo = this.form.value.segRiesgo / 100;
    if (this.id == null) {
      this.bancoService.addBanco(this.form.value)
        .then((response) => this.router.navigate(["bank"]))
        .catch((error) => console.log(error))
    } else {
      this.bancoService.updateBanco(this.form.value)
        .then((response) => this.router.navigate(["bank"]))
        .catch((error) => console.log(error))
    }
  }
}
