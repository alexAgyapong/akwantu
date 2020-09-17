import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  modalRef: BsModalRef;
  travelClasses: { name: string, value: string }[] = [
    { name: 'Economy', value: 'Economy' },
    { name: 'Premium Economy', value: 'Premium Economy' },
    { name: 'Business', value: 'Business' },
    { name: 'First', value: 'FIRST' }
  ];
  constructor(private fb: FormBuilder, private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.setupForm();
    this.searchForm.valueChanges.subscribe(input => console.log({ input }));
  }


  private setupForm(): void {
    this.searchForm = this.fb.group({
      from: [''],
      to: [''],
      departureDate: [''],
      returnDate: [''],
      tripType: ['return'],
      travelClass: ['']
    });
  }



  showTravellersModal(template: TemplateRef<any>): void {
    const config = {
      class: 'full-screen'
    };
    this.modalRef = this.bsModalService.show(template);
  }
}
