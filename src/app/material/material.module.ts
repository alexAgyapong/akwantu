import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule  } from '@angular/material/icon';
import {MatToolbarModule } from '@angular/material/toolbar';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';



const MaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatDialogModule
];


@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})
export class MaterialModule { }
