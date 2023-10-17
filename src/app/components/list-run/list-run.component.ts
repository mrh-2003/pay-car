import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Corrida } from 'src/app/models/corrida';
import { Periodo } from 'src/app/models/periodo';
import { CorridaService } from 'src/app/services/corrida.service';

@Component({
  selector: 'app-list-run',
  templateUrl: './list-run.component.html',
  styleUrls: ['./list-run.component.scss']
})
export class ListRunComponent {
  corrida: Corrida = new Corrida();
  periodos: Periodo[] = []
  constructor(private corridaService: CorridaService, private route: ActivatedRoute){}
  ngOnInit(){
    const id = this.route.snapshot.params["id"]
    this.corridaService.getCorrida(id).subscribe((data: Corrida)=> {
      this.corrida = data;
      this.generateData();
    });
  }
  calcularSaldoInicial(){
    return this.corrida.precio * (1 - (this.corrida.inicial/100)) /* + 
          this.corrida.banco.cosNotariales + 
          this.corrida.banco.cosRegistrales + 
          this.corrida.banco.tasacion + 
          this.corrida.banco.comEstudio + 
          this.corrida.banco.comActivacion; */
  }
  calcularCuota(periodo: Periodo, tiempo: number) {
    const cuota = periodo.saldo - (this.corrida.precio *(this.corrida.final/100))/Math.pow(1+(this.corrida.tasa / 100 + this.getSegDesg()), this.corrida.gracia.length -tiempo)

    return  cuota * ((this.corrida.tasa / 100 + this.getSegDesg())/ (1- Math.pow(1+(this.corrida.tasa / 100+ this.getSegDesg()), -(this.corrida.gracia.length - tiempo))))
  }
  generateData(){
    this.periodos.push({
      cuota: 0,
      interes:0,
      amort: 0,
      segDes: 0,
      saldo: this.calcularSaldoInicial(),
      flujo: this.calcularSaldoInicial(),
    })
    for (let i = 0; i < this.corrida.gracia.length; i++) {
      const periodo: Periodo = new Periodo();
      periodo.interes = this.periodos[i].saldo * (this.corrida.tasa/100);
      periodo.segDes = this.getSegDesg() * this.periodos[i].saldo;
      periodo.cuota = this.calcularCuota(this.periodos[i], i);
      if(this.corrida.gracia[i] == "Total"){
        periodo.cuota = 0;
      }
      periodo.amort = periodo.cuota - periodo.interes - periodo.segDes; 
      if(this.corrida.gracia[i] == "Parcial"){
        periodo.amort = 0;
      }
      periodo.saldo = this.periodos[i].saldo - periodo.amort;
      periodo.flujo = periodo.cuota + this.getSeguroRiesgo() + this.corrida.banco.portes + this.corrida.banco.gastosAdmin + this.corrida.banco.comPeriodica + this.corrida.banco.gastosAdmin
      this.periodos.push(periodo);
    }
    const periodo: Periodo = new Periodo();
    periodo.cuota = this.corrida.precio *(this.corrida.final/100)
    periodo.interes = 0;
    periodo.segDes = 0;
    periodo.amort = periodo.cuota;
    periodo.saldo = this.periodos[this.corrida.gracia.length].saldo - periodo.amort;
    periodo.flujo = periodo.cuota
    this.periodos.push(periodo)
  }
  formatearNumero(numero: number): { valor: string, css: string } {
    if (numero >= 0) {
      return { valor: numero.toFixed(2), css: 'azul' };
    }
    return { valor: `(${Math.abs(numero).toFixed(2)})`, css: 'rojo' };
  }
  getSegDesg(){
    return (this.corrida.banco.segDesgravamen  / 100) / (360 / this.getDias(this.corrida.frecPago))
  }
  getGracia(i : number){
    if(i == 0 || i == this.corrida.gracia.length + 1) {
      return "-";
    }
    else {
      return this.corrida.gracia[i - 1]
    }
  }

  abs(numero: number){
    return Math.abs(numero)
  }
  getSeguroRiesgo(){
    return this.corrida.precio *((this.corrida.banco.segRiesgo / 100)  / (360 / this.getDias(this.corrida.frecPago)))
  }

  getVan(){
    
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
}
