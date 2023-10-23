import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Corrida } from 'src/app/models/corrida';
import { Periodo } from 'src/app/models/periodo';
import { CorridaService } from 'src/app/services/corrida.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-list-run',
  templateUrl: './list-run.component.html',
  styleUrls: ['./list-run.component.scss']
})
export class ListRunComponent {
  corrida: Corrida = new Corrida();
  periodos: Periodo[] = []
  cambio = false
  id: string = "";
  constructor(private corridaService: CorridaService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }
  ngOnInit() {
    this.id = this.route.snapshot.params["id"]
    this.corridaService.getCorrida(this.id).subscribe((data: Corrida) => {
      if (data && this.corrida.id != data.id) {
        this.corrida = data;
        this.generateData();
      }
    });
  }
  calcularSaldoInicial() {
    return this.corrida.precio * (1 - (this.corrida.inicial / 100)) +
      this.corrida.banco.cosNotariales +
      this.corrida.banco.cosRegistrales +
      this.corrida.banco.tasacion +
      this.corrida.banco.comEstudio +
      this.corrida.banco.comActivacion;
  }
  /*   calcularCuota() {
      const cuota = this.periodos[0].saldo - (this.corrida.precio *(this.corrida.final/100))/Math.pow(1+(this.corrida.tasa / 100 + this.getSegDesg()), this.corrida.gracia.length)
      return  cuota * ((this.corrida.tasa / 100 + this.getSegDesg())/ (1- Math.pow(1+(this.corrida.tasa / 100+ this.getSegDesg()), -this.corrida.gracia.length )))
    } */
  calcularCuota(periodo: Periodo, i: number) {
    const cuota = periodo.saldo - (this.corrida.precio * (this.corrida.final / 100)) / Math.pow(1 + (this.corrida.tasa / 100 + this.getSegDesg()), this.corrida.gracia.length + 1 - i)
    return cuota * ((this.corrida.tasa / 100 + this.getSegDesg()) / (1 - Math.pow(1 + (this.corrida.tasa / 100 + this.getSegDesg()), -(this.corrida.gracia.length + 1 - i))))
  }
  seleccionCambiada() {
    this.periodos = []
    this.generateData()
    this.cambio = true
  }
  updateData() {
    this.corridaService.updateCorrida(this.corrida);
    this.router.navigate(["history"])
  }
  generateData() {
    this.periodos.push({
      cuota: 0,
      interes: 0,
      amort: 0,
      segDes: 0,
      saldo: this.calcularSaldoInicial(),
      flujo: this.calcularSaldoInicial(),
    })
    for (let i = 0; i < this.corrida.gracia.length; i++) {
      const periodo: Periodo = new Periodo();
      periodo.interes = this.periodos[i].saldo * (this.corrida.tasa / 100);
      periodo.segDes = this.getSegDesg() * this.periodos[i].saldo;
      periodo.cuota = this.calcularCuota(this.periodos[i], i);
      //Cambiar aqui, tomar en cuenta que el seguro de desgravamen siempre se cobra 
      if (this.corrida.gracia[i] == "Total") {
        periodo.cuota = 0;
      }
      periodo.amort = periodo.cuota - periodo.interes - periodo.segDes;
      if (this.corrida.gracia[i] == "Parcial") {
        periodo.amort = 0;
      }
      periodo.saldo = this.periodos[i].saldo - periodo.amort;
      periodo.flujo = periodo.cuota + this.getSeguroRiesgo() + this.corrida.banco.portes + this.corrida.banco.gastosAdmin + this.corrida.banco.comPeriodica
      this.periodos.push(periodo);
    }
    const periodo: Periodo = new Periodo();
    periodo.cuota = this.corrida.precio * (this.corrida.final / 100)
    periodo.interes = 0;
    periodo.segDes = 0;
    periodo.amort = periodo.cuota;
    periodo.saldo = this.periodos[this.corrida.gracia.length].saldo - periodo.amort;
    periodo.flujo = periodo.cuota
    this.periodos.push(periodo);

  }
  formatearNumero(numero: number): { valor: string, css: string } {
    if (numero >= 0) {
      return { valor: numero.toFixed(2), css: 'azul' };
    }
    return { valor: `(${Math.abs(numero).toFixed(2)})`, css: 'rojo' };
  }
  getSegDesg() {
    return (this.corrida.banco.segDesgravamen / 100) / (360 / this.getDias(this.corrida.frecPago))
  }

  abs(numero: number) {
    return Math.abs(numero)
  }
  getSeguroRiesgo() {
    return this.corrida.precio * ((this.corrida.banco.segRiesgo / 100) / (360 / this.getDias(this.corrida.frecPago)))
  }

  getVan() {
    let van = 0;
    for (let i = 1; i < this.periodos.length; i++) {
      van -= this.periodos[i].flujo / Math.pow(1 + (this.corrida.COK / 100) / (360 / this.getDias(this.corrida.frecPago)), i);
    }
    return van + this.calcularSaldoInicial();
  }

  getTIR() {
    let tir = 0.1;
    let nuevoTir = 1.1;
    let error = 1;

    while (error > 0.0001) {
      let valorActualNeto = 0;
      let derivadaValorActualNeto = 0;

      for (let i = 0; i < this.periodos.length; i++) {
        if (i == 0)
          valorActualNeto -= this.periodos[i].flujo / Math.pow(1 + tir, i);
        else
          valorActualNeto += this.periodos[i].flujo / Math.pow(1 + tir, i);

        derivadaValorActualNeto -= (i * this.periodos[i].flujo) / Math.pow(1 + tir, i + 1);
      }

      nuevoTir = tir - (valorActualNeto / derivadaValorActualNeto);
      error = Math.abs((nuevoTir - tir) / nuevoTir);
      tir = nuevoTir;
    }

    return tir * 100;
  }

  getDias(periodo: string): number {
    switch (periodo) {
      case "Mensual": return 30;
      case "Bimestral": return 60;
      case "Trimestral": return 90;
      case "Semestral": return 180;
      case "Anual": return 360;
      default: return 1;
    }
  }

  deleteData() {
    this.dialog.open(DeleteDialogComponent, {
      width: '500px'
    }).afterClosed().subscribe((response) => {
      if (response) {
        this.corridaService.deleteCorrida(this.id).then(() => this.router.navigate(["history"]));
      }
    })
  }
}
