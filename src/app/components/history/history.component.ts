import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Corrida } from 'src/app/models/corrida';
import { CorridaService } from 'src/app/services/corrida.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  displayedColumns: string[] = ['fecha' ,'moneda', 'precio', 'tasa', 'frecPago', 'plazo', 'banco', 'actions'];
  dataSource = new MatTableDataSource<Corrida>();
  idUser!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private corridaService: CorridaService, private auth: AngularFireAuth){}
  ngOnInit(){
    this.showCorridas();
  }
  async showCorridas(){
    await this.auth.currentUser.then((response)=>this.idUser = response?.uid as string);
    this.corridaService.getCorridasByUserID(this.idUser).subscribe((corridas: Corrida[]) => {
      this.dataSource = new MatTableDataSource(corridas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  round(numero: number){
    return numero.toFixed(2)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
