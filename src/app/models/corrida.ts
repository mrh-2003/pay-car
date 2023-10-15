import { Banco } from "./banco";
import { PeriodoGracia } from "./periodoGracia";

export class Corrida {
    id: string  ="";
    moneda: string = "";
    precio : number = 0; 
    inicial: number = 0; 
    final: number = 0; 
    tasa: number = 0; 
    frecPago: string = "";
    plazo: number = 0; 
    COK: number = 0; 
    gracia : string[] = [];
    idUsuario: string = "";
    banco: Banco = new Banco(); 
}