import { Component } from '@angular/core';

@Component({
  selector: 'app-add-edit-bank',
  templateUrl: './add-edit-bank.component.html',
  styleUrls: ['./add-edit-bank.component.scss']
})
export class AddEditBankComponent {
  form !: FormGroup;
  constructor(private fb: FormBuilder){}
  ngOnInit(){

  }

}
