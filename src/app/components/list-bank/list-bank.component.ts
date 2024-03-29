import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Banco } from 'src/app/models/banco';
import { BancoService } from 'src/app/services/banco.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: ['./list-bank.component.scss']
})
export class ListBankComponent {
  displayedColumns: string[] = ['nombre', 'gasInicial', 'gasPeriodicos', 'segDesgravamen', 'segRiesgo', 'actions'];
  dataSource = new MatTableDataSource<Banco>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private bancoService: BancoService,
    public dialog: MatDialog) {}

  ngOnInit(){
    this.showBanks();
  }

  showBanks(){
    this.bancoService.getBancos().subscribe((bancos: Banco[]) => {
      this.dataSource = new MatTableDataSource(bancos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteBank(id: string){
    this.dialog.open(DeleteDialogComponent, {
      width: '500px'
    }).afterClosed().subscribe((response) => {
      if (response) {
        this.bancoService.deleteBanco(id);
      }
    })
  }
}
