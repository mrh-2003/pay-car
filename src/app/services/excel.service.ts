import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Corrida } from '../models/corrida';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(tableData: any[], van: number, tir: number, corrida: Corrida) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

    XLSX.utils.sheet_add_aoa(worksheet, [['PLAN DE PAGOS PAY CAR']], { origin: 'N2' });
    XLSX.utils.sheet_add_aoa(worksheet, [['Moneda:', corrida.moneda.toUpperCase()]], { origin: 'N3' });
    XLSX.utils.sheet_add_aoa(worksheet, [['Precio:', corrida.precio]], { origin: 'N4' });
    XLSX.utils.sheet_add_aoa(worksheet, [['Inicial:', corrida.inicial]], { origin: 'N5' });
    XLSX.utils.sheet_add_aoa(worksheet, [['Final:', corrida.final]], { origin: 'N6' });
    XLSX.utils.sheet_add_aoa(worksheet, [['TE'+corrida.frecPago[0]+':', corrida.tasa]], { origin: 'N7' });
    XLSX.utils.sheet_add_aoa(worksheet, [['Frecuencia:', corrida.frecPago.toUpperCase()]], { origin: 'N8' });
    XLSX.utils.sheet_add_aoa(worksheet, [['COK:', corrida.COK]], { origin: 'N9' });
    XLSX.utils.sheet_add_aoa(worksheet, [['Estado:', corrida.status.toUpperCase()]], { origin: 'N10' });
    XLSX.utils.sheet_add_aoa(worksheet, [['VAN:', van]], { origin: 'N11' });
    XLSX.utils.sheet_add_aoa(worksheet, [['TIR:', tir]], { origin: 'N12' });

    const workbook: XLSX.WorkBook = { Sheets: { 'PayCar': worksheet }, SheetNames: ['PayCar'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, 'Plan de pagos ' + new Date().toLocaleString() + '.xlsx');
  }
  
  
}
