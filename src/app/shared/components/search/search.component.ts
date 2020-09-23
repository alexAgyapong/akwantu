import { Component, EventEmitter, OnInit, Output, TemplateRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, EMPTY, Observer } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { LocationData, LocationRequest } from '../../models/locations';
import { LocationService } from './../../services/location.service';
import { SearchParam } from '../../models/search-param';

import moment from 'moment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() isMobile = false;
  @Output() searchTerms = new EventEmitter<any>();
  searchForm: FormGroup;
  modalRef: BsModalRef;
  classAndTravellers: string;
  searchTerm: string;
  suggestions$: any;
  destinationSuggestions$: Observable<any>;
  originCode: string;
  origin: string;
  destination: string;
  allParams: SearchParam;

  returnDate = moment(new Date()).add(7, 'days').toDate();

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
    { name: 'Economy', value: 'ECONOMY' },
    { name: 'Premium Economy', value: 'PREMIUM_ECONOMY' },
    { name: 'Business', value: 'BUSINESS' },
    { name: 'First', value: 'FIRST' }
  ];

  constructor(private fb: FormBuilder,
    private locationService: LocationService,
    private bsModalService: BsModalService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('moment date', this.returnDate)
    this.setupForm();

    this.route.queryParams.subscribe(params => {
      this.allParams = { ...params } as unknown as SearchParam;
      console.log('form BEFORE', this.searchForm.value);
      if (this.allParams.departureDate) {
        this.patchForm(this.allParams);
      }
      console.log({ params }, 'all params', this.allParams);
      console.log('form AFTER', this.searchForm.value);

    })

    if (!this.classAndTravellers) { this.classAndTravellers = `1 traveller, Economy`; }
    this.searchForm.valueChanges.subscribe(input => {
      console.log({ input });
      const allTravellers = (+input?.adults) + (+input?.children) + (+input?.infants);
      this.classAndTravellers = `${allTravellers} travellers, ${input?.travelClass}`;
      console.log({ allTravellers });

    });

    // Typeahead suggestions for origin and destination
    this.getSuggestions();
    this.getDestinationSuggestions();
  }

  patchForm(param: SearchParam): void {
    if (param) {
      this.searchForm.patchValue({
        origin: param?.origin,
        destination: param?.destination,
        departureDate: new Date(param?.departureDate),
        returnDate: new Date(param?.returnDate),
        tripType: param?.tripType,
        travelClass: param?.travelClass,
        adults: param?.adults,
        children: param?.children,
        infants: param?.infants
      });
    }
  }


  private setupForm(): void {
    this.searchForm = this.fb.group({
      origin: [''],
      destination: [''],
      departureDate: new Date(),
      returnDate: this.returnDate,
      tripType: ['return'],
      travelClass: ['ECONOMY'],
      adults: ['1'],
      children: ['0'],
      infants: ['0']
    });
  }

  getSuggestions(): void {
    this.suggestions$ = new Observable((input$: Observer<string>) => {
      input$.next(this.searchForm.get('origin').value);
    })
      .pipe(debounceTime(1000),
        switchMap((query: string) => {
          if (query) {
            const req = { subType: 'CITY', keyword: query } as LocationRequest;
            return this.locationService.getLocation(req);
          }
          else { return EMPTY; }
        })
      );
  }

  getDestinationSuggestions(): void {
    this.destinationSuggestions$ = new Observable((input$: Observer<string>) => {
      input$.next(this.searchForm.get('destination').value);
    })
      .pipe(debounceTime(1000),
        switchMap((query: string) => {
          if (query) {
            const req = { subType: 'CITY', keyword: query } as LocationRequest;
            return this.locationService.getLocation(req);
          }
          else { return EMPTY; }
        })
      );
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
        if (numOfAdults > 1) { this.adultsControl.setValue(numOfAdults - 1); }
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

  showAutocomplete(): void {
    console.log('autocompelete');

  }

  onSelectOrigin(event: TypeaheadMatch): void {
    console.log({ event });
    const { item } = event;
    const { iataCode } = item as LocationData;
    this.origin = iataCode;
  }

  onSelectDestination(event: TypeaheadMatch): void {
    console.log({ event });
    const { item } = event;
    const { iataCode } = item as LocationData;
    this.destination = iataCode;
  }

  searchFlights(): void {
    let searchTerms = { ...this.searchForm.value } as SearchParam;
    console.log('search flights before', searchTerms);
    searchTerms.origin = this.origin;
    searchTerms.destination = this.destination;
    console.log({ searchTerms });

    this.router.navigate(['/flights'], { queryParams: searchTerms });
    if (this.isMobile) {
      this.searchTerms.emit(searchTerms);
    }

  }
}

