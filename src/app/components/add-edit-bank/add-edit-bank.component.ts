import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-edit-bank',
  templateUrl: './add-edit-bank.component.html',
  styleUrls: ['./add-edit-bank.component.scss']
})
export class AddEditBankComponent {
  form !: FormGroup ;
  constructor(private fb: FormBuilder){}
  ngOnInit(){

  }

}
