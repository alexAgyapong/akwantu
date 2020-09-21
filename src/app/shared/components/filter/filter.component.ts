import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  filterForm: FormGroup;
  isCollapsed = true;
  isDepTimesCollapsed = true;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      stops: [''],
      departureTime: [''],
      returnTime: [''],
      duration: [''],
      airlines: [''],
      airports: [''],
      price: [''],
      cabinBag: [''],
      checkedBag: [''],
      paymentMethod: ['']
    });

  }

}
