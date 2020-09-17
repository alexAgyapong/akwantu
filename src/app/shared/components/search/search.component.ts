import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  modalRef: BsModalRef;

  get adultsControl(): FormControl {
    return this.searchForm.get('adults') as FormControl;
  }

  get childrenControl(): FormControl {
    return this.searchForm.get('children') as FormControl;
  }

  get infantsControl(): FormControl {
    return this.searchForm.get('infants') as FormControl;
  }

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
      travelClass: ['Economy'],
      adults: ['1'],
      children: ['0'],
      infants: ['0']
    });
  }

  increaseNumber(type: string): void {
    const numOfAdults = +this.adultsControl.value;
    const numOfchildren = +this.childrenControl.value;
    const numOfInfants = +this.infantsControl.value;

    switch (type) {
      case 'adults':
        this.adultsControl.setValue(numOfAdults + 1);
        break;
      case 'children':
        this.childrenControl.setValue(numOfchildren + 1);
        break;
      case 'infants':
        this.infantsControl.setValue(numOfInfants + 1);
        break;
    }
  }

  decreaseNumber(type: string): void {
    const numOfAdults = +this.adultsControl.value;
    const numOfchildren = +this.childrenControl.value;
    const numOfInfants = +this.infantsControl.value;
    switch (type) {
      case 'adults':
        if (numOfAdults > 0) { this.adultsControl.setValue(numOfAdults - 1); }
        break;
      case 'children':
        if (numOfchildren > 0) { this.childrenControl.setValue(numOfchildren - 1); }
        break;
      case 'infants':
        if (numOfInfants > 0) { this.infantsControl.setValue(numOfInfants - 1); }
        break;
    }
  }


  showTravellersModal(template: TemplateRef<any>): void {
    const config = {
      class: 'full-screen'
    };
    this.modalRef = this.bsModalService.show(template);
  }
}
