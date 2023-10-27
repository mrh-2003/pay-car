import { Component } from '@angular/core';

@Component({
  selector: 'app-compare-banks',
  templateUrl: './compare-banks.component.html',
  styleUrls: ['./compare-banks.component.scss']
})
export class CompareBanksComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  
}
