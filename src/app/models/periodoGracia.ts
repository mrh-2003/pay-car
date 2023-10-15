export class PeriodoGracia {
    id: number = 0; 
    gracia : string = "";

    toJSON() {
        return {
          id: this.id,
          gracia: this.gracia,
        };
    }
}