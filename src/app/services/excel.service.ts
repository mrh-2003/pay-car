import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(tableData: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
  
    // Crear una celda adicional para el título en H1
    XLSX.utils.sheet_add_aoa(worksheet, [['Plan de pagos']], { origin: 'H1' });
    // Crear una celda adicional para la descripción en H2
    XLSX.utils.sheet_add_aoa(worksheet, [['Hola']], { origin: 'H2' });
  
    const workbook: XLSX.WorkBook = { Sheets: { 'PayCar': worksheet }, SheetNames: ['PayCar'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, 'Plan de pagos ' + new Date().toLocaleString() + '.xlsx');
  }
  
  
}
