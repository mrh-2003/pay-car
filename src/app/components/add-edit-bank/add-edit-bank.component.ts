import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BancoService } from 'src/app/services/banco.service';

@Component({
  selector: 'app-add-edit-bank',
  templateUrl: './add-edit-bank.component.html',
  styleUrls: ['./add-edit-bank.component.scss']
})
export class AddEditBankComponent {
  form !: FormGroup ;
  constructor(private fb: FormBuilder , private bancoService: BancoService ){}
  ngOnInit(){
    this.form= this.fb.group({
      id: "",
      nombre: ['', Validators.required],
      cosNotariales : ['', Validators.required],
      cosRegistrales : ['', Validators.required],
      tasacion: ['', Validators.required],
      comEstudio: ['', Validators.required],
      comActivacion: ['', Validators.required],
      comPeriodica: ['', Validators.required],
      portes: ['', Validators.required],
      gastosAdmin: ['', Validators.required],
      segDesgravamen: ['', Validators.required],
      segRiesgo: ['', Validators.required],
    })
  }

  addBank(){
   this.bancoService.addBanco(this.form.value)
    .then((response)=> console.log(response))
    .catch((error) => console.log(error)) 
  }



}
