import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule  } from '@angular/material/icon';
import {MatToolbarModule } from '@angular/material/toolbar';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule } from '@angular/material/form-field';


const MaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatFormFieldModule
];


@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})
export class MaterialModule { }
