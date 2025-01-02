import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  employeeForm : FormGroup = new FormGroup({});
  employeeObj : EmployeeModel = new EmployeeModel();
  employeeList : EmployeeModel[] = [];
  isEditMode: boolean = false;

  constructor(){
    this.createForm();
    const oldData = localStorage.getItem("EmpData");
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  reset(){
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  createForm(){
    this.employeeForm = new FormGroup({
      empId : new FormControl(this.employeeObj.empId),
      name : new FormControl(this.employeeObj.name,[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
      city : new FormControl(this.employeeObj.city),
      address : new FormControl(this.employeeObj.address),
      contactNo : new FormControl(this.employeeObj.contactNo,[Validators.required,Validators.pattern("^[0-9]{10}$")]),
      emailId : new FormControl(this.employeeObj.emailId,[Validators.required,Validators.email]),
      state : new FormControl(this.employeeObj.state),
      pinCode : new FormControl(this.employeeObj.pinCode,[Validators.required,Validators.pattern("^[0-9]{6}$")])
    });
  }

  onSave(){
    this.isEditMode = false;
    const oldData = localStorage.getItem("EmpData");
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    }else{
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData",JSON.stringify(this.employeeList));
    this.reset();
  }

  onEdit(item : EmployeeModel){
    this.isEditMode = true;
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate(){
    const record = this.employeeList.find(m=>m.empId == this.employeeForm.controls['empId'].value);
    if(record != null){
      record.name = this.employeeForm.controls['name'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.address = this.employeeForm.controls['address'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.state = this.employeeForm.controls['state'].value;
      record.pinCode = this.employeeForm.controls['pinCode'].value;
    }
    localStorage.setItem("EmpData",JSON.stringify(this.employeeList));
    this.reset();
    this.isEditMode = false;
  }

  onDelete(id : number){
    const isDelete = confirm("Are you sure you want to delete this record?");
    if(isDelete){
      const index = this.employeeList.findIndex(m=>m.empId == id);
      this.employeeList.splice(index,1);
      localStorage.setItem("EmpData",JSON.stringify(this.employeeList));
      this.reset();
    }
  }


  // allowOnlyNumbers(event: KeyboardEvent): void {
  //   const charCode = event.which || event.keyCode;
  //   // Allow only numbers (48-57 for digits) and control keys (e.g., backspace, arrow keys)
  //   if (charCode < 48 || charCode > 57) {
  //     event.preventDefault();
  //   }
  // }

}
