import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banco } from 'src/app/models/banco';
import { BancoService } from 'src/app/services/banco.service';
import { CorridaService } from 'src/app/services/corrida.service';

@Component({
  selector: 'app-smart-credit',
  templateUrl: './smart-credit.component.html',
  styleUrls: ['./smart-credit.component.scss']
})
export class SmartCreditComponent {
  form!: FormGroup;
  bancos: Banco[] = []
  info = {}
  constructor(private fb: FormBuilder,
    private corridaService: CorridaService,
    private auth: AngularFireAuth,
    private bancoService: BancoService
    
    ){}
  ngOnInit(){
    this.bancoService.getBancos().subscribe((datos: Banco[])=> this.bancos = datos);
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
        COK: ['', [Validators.required, Validators.min(1)]],
        banco: ['', Validators.required],
      }
    )
  }

  getDias(periodo: string): number{
    switch (periodo) {
      case "Mensual": return 30; 
      case "Bimestral": return 60; 
      case "Trimestral": return 90; 
      case "Semestral": return 180; 
      case "Anual": return 360; 
      default: return 1; 
    }
  }

  async addCorrida(){
    const info = this.form.value;
    info.tasa = info.tasa / 100;
    info.inicial = info.inicial / 100;
    info.final = info.final / 100;
    info.COK = info.COK / 100;
    //Filtramos solo lo que queremos guardar
    const camposDeseados = ['moneda', 'precio', 'inicial', 'final', 'tasa', 'frecPago', 'plazo', 'COK', 'banco']
    const corrida: any = {};
    for (const campo of camposDeseados) {
      corrida[campo] = info[campo];
    }
    corrida.fecha = new Date().toDateString();
    await this.auth.currentUser.then((response)=>corrida.idUsuario = response?.uid as string);
    if(info.tipoTasa == "TN"){ //Calculamos la tasa efectiva
      corrida.tasa = Math.pow(1 +  info.tasa / 
      (this.getDias(info.periodoTasa) / this.getDias(info.capiTasa)),
      this.getDias(info.frecPago) / this.getDias(info.capiTasa)) - 1
    }
    corrida.gracia = []
    //Agregamos los periodos de gracia    
    for (let periodo = 0; periodo < info.plazo * 360 / this.getDias(info.frecPago); periodo++) {
      if(periodo < info.graciaTotal){
        corrida.gracia.push("Total");
      } else if(periodo < info.graciaTotal + info.graciaParcial) {
        corrida.gracia.push("Parcial");
      } else{
        corrida.gracia.push("Normal");
      }
    }    
    await this.corridaService.addCorrida(corrida)
    .then((response)=> console.log(response))
    .catch((error)=> console.log(error)) 
  }
}
