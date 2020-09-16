import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule  } from '@angular/material/icon';
import {MatToolbarModule } from '@angular/material/toolbar';


const MaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatToolbarModule
];


@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})
export class MaterialModule { }
