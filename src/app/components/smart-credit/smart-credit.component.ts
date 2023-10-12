import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-credit',
  templateUrl: './smart-credit.component.html',
  styleUrls: ['./smart-credit.component.scss']
})
export class SmartCreditComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder){}
  ngOnInit(){
    this.form = this.fb.group(
      {
        moneda : ['',Validators.required],
        precio : ['',[Validators.required, Validators.min(1000)]],
        inicial : ['', [Validators.required, Validators.min(15), Validators.max(25)]],
        final:['', [Validators.required, Validators.min(40), Validators.max(60)]],
        tipoTasa: ['', Validators.required],
        periodoTasa: ['', Validators.required],
        capiTasa: '',
        tasa: ['',[Validators.required, Validators.min(1)]],
        frecPago: ['', Validators.required],
        plazo: ['',[Validators.required, Validators.min(1)]],
        graciaParcial: ['', Validators.min(0)],
        graciaTotal: ['', Validators.min(0)],
        COK: ['', [Validators.required, Validators.min(1)]]
      }
    )
  }
}
