import { Component } from '@angular/core';
import { Banco } from 'src/app/models/banco';
import { BancoService } from 'src/app/services/banco.service';

@Component({
  selector: 'app-compare-banks',
  templateUrl: './compare-banks.component.html',
  styleUrls: ['./compare-banks.component.scss']
})
export class CompareBanksComponent {
  constructor(private bancoService: BancoService){}
  expandedIndex = 0;
  paycar : Banco = new Banco()
  bancos !: Banco[]
  ngOnInit(){
    this.bancoService.getBancos().subscribe((bancos: Banco[]) => {
      this.bancos = bancos.filter(banco => banco.nombre != 'PayCar')
      this.paycar = bancos.filter(banco => banco.nombre == 'PayCar')[0]
    })
  }

}
