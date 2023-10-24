import { Banco } from "./banco";
import { PeriodoGracia } from "./periodoGracia";

export class Corrida {
    id: string  ="";
    fecha: string = "";
    moneda: string = "";
    precio : number = 0; 
    inicial: number = 0; 
    final: number = 0; 
    tasa: number = 0; 
    frecPago: string = "";
    plazo: number = 0; 
    COK: number = 0; 
    gracia : string[] = [];
    status: string = "";
    idReference : string = ""; //el id del antigua corrida
    montoActual : number = 0; //valor actual del vehiculo - cuota(seg des + interes+amort)
    idUsuario: string = "";
    banco: Banco = new Banco();
}