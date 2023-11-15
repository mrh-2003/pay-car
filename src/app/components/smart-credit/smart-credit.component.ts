import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Banco } from 'src/app/models/banco';
import { Corrida } from 'src/app/models/corrida';
import { BancoService } from 'src/app/services/banco.service';
import { CorridaService } from 'src/app/services/corrida.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-smart-credit',
  templateUrl: './smart-credit.component.html',
  styleUrls: ['./smart-credit.component.scss']
})
export class SmartCreditComponent {
  form!: FormGroup;
  banco!: Banco
  mostrar :any= {};
  run: boolean = false;
  id!: string;
  idCar!: string;
  soloLeer = false
  reference : any =  {};
  constructor(private fb: FormBuilder,
    private corridaService: CorridaService,
    private auth: AngularFireAuth,
    private bancoService: BancoService,
    private router : Router,
    private route: ActivatedRoute,
    private vehiculoService: VehiculoService
    ){}
  async ngOnInit(){
    if(this.route.snapshot.url.length == 2){
      this.id = this.route.snapshot.params["id"];
    }
    if(this.id){
      this.corridaService.getCorrida(this.id).subscribe(
        (data: Corrida)=> this.reference = data )
    }
    this.bancoService.getBancoByName("PayCar").subscribe((datos: Banco[])=> this.banco = datos[0]);
    this.form = this.fb.group(
      {
        moneda : ['',Validators.required],
        precio : ['',[Validators.required, Validators.min(1000)]],
        inicial : ['', [Validators.required, Validators.min(15), Validators.max(25)]],
        final:['', [Validators.required, Validators.min(40), Validators.max(60)]],
        tipoTasa: ['', Validators.required],
        periodoTasa: ['', Validators.required],
        capiTasa: '',
        tasa: ['',[Validators.required, Validators.min(0)]],
        frecPago: ['', Validators.required],
        plazo: ['',[Validators.required, Validators.min(1)]],
        graciaParcial: ['', [Validators.required, Validators.min(0)]],
        graciaTotal: ['', [Validators.required, Validators.min(0)]],
        COK: ['', [Validators.required, Validators.min(1)]]
      }
    )
    if(this.route.snapshot.url.length == 3){
      this.idCar = this.route.snapshot.params["idCar"];
      await this.vehiculoService.getVehiculo(this.idCar).subscribe(
        (response)=> {
          this.mostrar.moneda = response.moneda;
          this.soloLeer = true;
          this.form = this.fb.group(
            {
              moneda : [{value: response.moneda, disabled: true},Validators.required],
              precio : [response.precio * (1 -  response.descuento / 100),[Validators.required, Validators.min(1000)]],
              inicial : [response.inicial, [Validators.required, Validators.min(15), Validators.max(25)]],
              final:['', [Validators.required, Validators.min(40), Validators.max(60)]],
              tipoTasa: ['', Validators.required],
              periodoTasa: ['', Validators.required],
              capiTasa: '',
              tasa: ['',[Validators.required, Validators.min(0)]],
              frecPago: ['', Validators.required],
              plazo: ['',[Validators.required, Validators.min(1)]],
              graciaParcial: ['',[Validators.required, Validators.min(0)]],
              graciaTotal: ['',[Validators.required, Validators.min(0)]],
              COK: ['', [Validators.required, Validators.min(1)]]
            })
        }
      )
    }
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

  round(numero: number){
    return numero.toFixed(2)
  }

  getTasaEfectiva(data: any){
    if(data.tipoTasa == 'TN'){
      return (Math.pow(1 +  (data.tasa  / 100)/ 
      (this.getDias(data.periodoTasa) / this.getDias(data.capiTasa)),
      this.getDias(data.frecPago) / this.getDias(data.capiTasa)) - 1) * 100
    } else{
      return (Math.pow(1+data.tasa/100, this.getDias(data.frecPago)/this.getDias(data.periodoTasa))-1)*100;
    }
  }

  validateRun(){
    this.run = true;  
    if(this.mostrar.moneda){
      this.form.value.moneda = this.mostrar.moneda;
    }
    this.mostrar = this.form.value;
    this.mostrar.banco = this.banco;
  }

  async addCorrida(){
    const info = this.mostrar;
    //Filtramos solo lo que queremos guardar
    const camposDeseados = ['moneda', 'precio', 'inicial', 'final', 'frecPago', 'plazo', 'COK', 'banco']
    const corrida: any = {};
    for (const campo of camposDeseados) {
      corrida[campo] = info[campo];
    }
    corrida.fecha = new Date().toDateString();
    await this.auth.currentUser.then((response)=>corrida.idUsuario = response?.uid as string);
    corrida.tasa = this.getTasaEfectiva(info)
    corrida.status = "normal";
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
    corrida.montoReference = 0;
    if(this.id){
      corrida.idReference = this.id;
      corrida.montoReference = this.reference.montoActual;
      this.reference.status = "renovar";
      corrida.status = "cliente";
      await this.corridaService.updateCorrida(this.reference);
    }
    await this.corridaService.addCorrida(corrida)
    .then( (response)=>  this.router.navigate(['show-run/'+response]))   
    .catch((error)=> console.log(error)) 
  }
}
