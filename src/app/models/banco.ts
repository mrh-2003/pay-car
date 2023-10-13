/* export class Banco{
  id?: string;
  nombre: string = "";
  cosNotariales : number =0;
  cosRegistrales : number =0;
  tasacion: number =0;
  comEstudio: number =0;
  comActivacion: number =0;
  comPeriodica: number =0;
  portes: number =0;
  gastosAdmin: number =0;
  segDesgravamen: number =0;
  segRiesgo: number =0;
}
 */
export interface Banco{
  id?: string;
  nombre: string;
  cosNotariales : number;
  cosRegistrales : number;
  tasacion: number;
  comEstudio: number;
  comActivacion: number;
  comPeriodica: number;
  portes: number;
  gastosAdmin: number;
  segDesgravamen: number;
  segRiesgo: number;
}