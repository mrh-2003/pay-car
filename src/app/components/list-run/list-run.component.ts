import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Corrida } from 'src/app/models/corrida';
import { Periodo } from 'src/app/models/periodo';
import { CorridaService } from 'src/app/services/corrida.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { OptionsDialogComponent } from '../options-dialog/options-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PriceDialogComponent } from '../price-dialog/price-dialog.component';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-list-run',
  templateUrl: './list-run.component.html',
  styleUrls: ['./list-run.component.scss']
})
export class ListRunComponent {
  corrida: Corrida = new Corrida();
  periodos: Periodo[] = []
  cambio = false;
  actions !: string;
  id: string = "";
  constructor(private corridaService: CorridaService,
    private route: ActivatedRoute,
    private router: Router,
    private excelService: ExcelService,
    public dialog: MatDialog) { }
  ngOnInit() {
    this.id = this.route.snapshot.params["id"]
    this.corridaService.getCorrida(this.id).subscribe((data: Corrida) => {
      if (data && this.corrida.id != data.id) {
        this.corrida = data;
        if (this.corrida.montoReference) {
          this.corrida.precio = this.corrida.precio - this.corrida.montoReference;
        }
        if (this.corrida.status == 'normal') {
          this.actions = "Comprar vehiculo"
        } else {
          this.actions = "Finalizar simulación";
        }
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
  calcularCuota(periodo: Periodo, i: number) {
    const cuota = periodo.saldo - (this.corrida.precio * (this.corrida.final / 100)) / Math.pow(1 + (this.corrida.tasa / 100 + this.getSegDesg()), this.corrida.gracia.length - i)
    return cuota * ((this.corrida.tasa / 100 + this.getSegDesg()) / (1 - Math.pow(1 + (this.corrida.tasa / 100 + this.getSegDesg()), -(this.corrida.gracia.length - i))))
  }
  seleccionCambiada() {
    this.periodos = []
    this.generateData()
    this.cambio = true
  }
  round(num: number) {
    return num.toFixed(2);
  }
  updateData() {
    this.corrida.precio = this.corrida.precio + this.corrida.montoReference;
    this.corridaService.updateCorrida(this.corrida);
    this.router.navigate(["history"])
  }

  actualizar() {
    this.router.navigate(["show-run/" + this.corrida.idReference]).then(() => this.ngOnInit())
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
    for (let i = 0; i <= this.corrida.gracia.length; i++) {
      const periodo: Periodo = new Periodo();
      periodo.interes = this.periodos[i].saldo * (this.corrida.tasa / 100);
      periodo.segDes = this.getSegDesg() * this.periodos[i].saldo;
      periodo.cuota = this.calcularCuota(this.periodos[i], i);
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
    const periodo: Periodo = this.periodos[this.corrida.gracia.length + 1];
    periodo.amort = this.corrida.precio * (this.corrida.final / 100)
    periodo.cuota = periodo.amort + periodo.segDes + periodo.interes;
    periodo.saldo = this.periodos[this.corrida.gracia.length].saldo - periodo.amort;
    periodo.flujo = periodo.cuota + this.getSeguroRiesgo() + this.corrida.banco.portes + this.corrida.banco.gastosAdmin + this.corrida.banco.comPeriodica
    this.periodos[this.corrida.gracia.length + 1] = periodo;
  }
  formatearNumero(numero: number): { valor: string, css: string } {
    if (numero >= 0) {
      return { valor: numero.toFixed(2), css: 'azul' };
    }
    return { valor: `(${Math.abs(numero).toFixed(2)})`, css: 'rojo' };
  }
  getSegDesg() {
    return this.corrida.banco.segDesgravamen / 100
  }
  export(){
    let data = []
    let i = 0;
    for (const p of this.periodos) {
      const fila = {
        Periodo: i,
        PG:  i == 0 || i == this.corrida.gracia.length + 1 ?  "-" : this.corrida.gracia[i - 1],
        Saldo: i == this.corrida.gracia.length + 1 ? 0 :  p.saldo,
        Amortizacion: -p.amort > 0 ? 0: -p.amort,
        Interes: -p.interes,
        Seg_Degravamen: -p.segDes,
        Cuota: -p.cuota,
        Seg_Riesgo: i!=0 ? -this.getSeguroRiesgo() : 0,
        Comision: i!=0? -this.corrida.banco.comPeriodica : 0,
        Portes: i!=0? -this.corrida.banco.portes : 0,
        Gast_Administrativos: i!=0? -this.corrida.banco.gastosAdmin : 0,
        Flujo: i == 0? p.flujo : -p.flujo,
      }
      i ++;
      data.push(fila)
    }
    this.excelService.exportToExcel(data, this.getVan(), this.getTIR(), this.corrida);
  }

  abs(numero: number) {
    return Math.abs(numero)
  }
  getSeguroRiesgo() {
    return this.corrida.precio * (this.corrida.banco.segRiesgo / 100)
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

  buyCorrida() {
    if (this.corrida.status == "normal") {
      this.actions = "Finalizar simulación";
      this.corrida.status = "cliente";
      this.corrida.precio = this.corrida.precio + this.corrida.montoReference;
      this.corridaService.updateCorrida(this.corrida); //el precio volverlo al valor original
    } else {
      this.dialog.open(OptionsDialogComponent, {
        width: '500px'
      }).afterClosed().subscribe((response) => {
        if (response) {
          this.dialog.open(ConfirmDialogComponent, {
            width: '500px'
          }).afterClosed().subscribe((confirm) => {
            if (confirm) {
              this.corrida.precio = this.corrida.precio + this.corrida.montoReference;
              switch (response) {
                case 1:
                  this.dialog.open(PriceDialogComponent, {
                    width: '300px'
                  }).afterClosed().subscribe((confirm) => {
                    if (confirm) {
                      this.corrida.montoActual = confirm - this.periodos[this.periodos.length - 1].cuota;
                      this.corridaService.updateCorrida(this.corrida);
                      this.router.navigate(['run/' + this.corrida.id])
                    }
                  });
                  break;
                case 2:
                  this.corrida.status = "comprar";
                  this.corridaService.updateCorrida(this.corrida);
                  break;
                case 3:
                  this.corrida.status = "cancelar";
                  this.corridaService.updateCorrida(this.corrida);
                  break;
              }
            }
          })
        }
      })
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
