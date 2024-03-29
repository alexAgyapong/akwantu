import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Dictionaries, FlightOffer, FlightResponse } from 'src/app/shared/models/flight';
import lodash from 'lodash';
import { Options, LabelType } from 'ng5-slider';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { SearchParam } from '../../models/search-param';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() flights: FlightOffer[] = [];
  @Input() resetFilters = false;
  filterForm: FormGroup;
  isCollapsed = false;
  isMaxPriceCollapsed = false;
  isAirlinesCollapsed = false;
  isCurrencyCollapsed = false;
  dictionaries: Dictionaries;
  airlines: Airline[] = [];
  airlineCodes: string[] = [];
  airlinesWithPrices: { code: string, price: number }[] = [];
  airlinesParam: string;
  selectedAirlines = [];

  options: Options = {
    floor: 1000,
    ceil: 5000,
    step: 100,
    translate: (value: number): string => {
      return `£${value}`;
    },
    showSelectionBar: true,
    getPointerColor: (value: number): string => {
      return '#808080';
    },
    getSelectionBarColor: (value: number): string => {
      return '#808080';
    }
  };

  currencies = [{ name: 'Pound Sterling', value: 'GBP' }, { name: 'Euro', value: 'EUR' }, { name: 'United States dollar', value: 'USD' }];
  subscription: Subscription;
  isFirstLoad = true;
  isAllSelected: boolean;

  private readonly defaultMaxPrice = 1000;

  private readonly defaultCurrencyCode = 'EUR';

  get airlineControls(): FormArray {
    return this.filterForm.get('airlines') as FormArray;
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.setAirlinesFares();
    if (this.resetFilters && this.filterForm) {
      this.selectedAirlines = [];
      this.filterForm.reset();
      this.filterForm.get('currencyCode').setValue(this.defaultCurrencyCode);
    }
  }

  ngOnInit(): void {
    this.getAirlines();
    this.setupForm();
    this.patchForm();
    this.setAirlinesFares();
    this.formChanges();
  }

  formChanges(): void {
    this.filterForm.valueChanges.pipe(debounceTime(1000)).subscribe((input) => {
      if (input) {
        console.log('slected alll', this.selectedAirlines);

        const airlines = Object.values(this.selectedAirlines)?.toString();
        const filters = {
          currencyCode: input.currencyCode,
          maxPrice: input.maxPrice,
          nonStop: input.nonStop,
          airlines
        };
        this.sendFilters(filters);
      }
    });
  }

  sendFilters(input: any): void {
    this.router.navigate(['/flights'], { queryParams: input, queryParamsHandling: 'merge' });
  }

  patchForm(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
      const nonStop = JSON.parse(params?.nonStop || 'false');
      this.airlinesParam = params.airlines;
      const maxPrice = +params.maxPrice;
      const currencyCode = params.currencyCode;

      this.airlineCodes = this.airlinesParam?.split(',');
      this.airlineCodes?.forEach(code => {
        this.airlines?.forEach((airline, i) => {
          if (airline.code === code) { airline.isChecked = true; }
        });
      });


      this.filterForm.patchValue({
        nonStop,
        maxPrice: maxPrice ? maxPrice : this.defaultMaxPrice,
        currencyCode: currencyCode ? currencyCode : this.defaultCurrencyCode
      });

      if (this.isFirstLoad) {
        this.setAirlinesControls();
      }
    });
  }

  setAirlinesControls(): void {
    this.airlines?.forEach((airline, i) => {
      this.airlineControls.controls[i].setValue(airline.isChecked, { emitEvent: false });
    });
  }

  setupForm(): void {
    this.filterForm = this.fb.group({
      nonStop: [false],
      airlines: this.addAirlinesControls(),
      maxPrice: [''],
      currencyCode: [this.defaultCurrencyCode],
      selectAll: [true]
      // cabin: [''],
      // checkedBag: [''],
      // paymentMethod: ['']
    });
  }

  addAirlinesControls(): FormArray {
    const control = this.airlines.map(el => this.fb.control(el.isChecked));
    return this.fb.array(control);
  }

  private getDictionaries(): void {
    const res = localStorage.getItem('offers');
    const response = JSON.parse(res) as FlightResponse;
    const { dictionaries } = response;
    this.dictionaries = dictionaries;
  }

  getAirlines(): void {
    this.getDictionaries();
    if (!this.dictionaries?.carriers) { return; }
    const keys = Object.keys(this.dictionaries?.carriers);
    keys?.forEach(key => {
      const airline = { code: key, name: this.dictionaries.carriers[key], isChecked: false, price: 0 };
      if (airline) { this.airlines.push(airline); }
    });
    // this.airlineCodes = this.airlines.map(x => x.code);
  }

  setAirlinesFares(): void {
    const allAirlines: { code: string, price: number }[] = [];
    this.flights?.forEach(flight => {
      const { validatingAirlineCodes, price } = flight;
      const airlineObject = { code: validatingAirlineCodes[0], price: +price.grandTotal };
      allAirlines.push(airlineObject);
    });

    const groupedAirlines = lodash.groupBy(allAirlines, 'code');
    const airlineCodes = Object.keys(groupedAirlines);

    airlineCodes.forEach(code => {
      const airline = lodash.min(groupedAirlines[code]);
      this.airlinesWithPrices.push(airline);
    });

    this.getAirlinePrice(this.airlines, this.airlinesWithPrices);
  }

  getSelectedAirlines(): void {
    this.isFirstLoad = false;
    this.selectedAirlines = [];
    this.airlineControls.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedAirlines.push(this.airlines[i].code);
        this.airlines[i].isChecked = true;
      }
    });
  }

  getAirlinePrice = (airlines: Airline[], prices: { code: string, price: number }[]) => {
    airlines?.forEach(airline => prices?.forEach(p => {
      if (airline.code === p.code) { airline.price = p.price; }
    }));
  }

  selectAll(selectAll = false): void {
    this.isFirstLoad = false;
    this.selectedAirlines = [];

    this.airlines?.forEach((airline, i) => {
      if (selectAll) {
        airline.isChecked = true;
        this.isAllSelected = true;
        this.selectedAirlines.push(this.airlines[i].code);
        this.filterForm.get('selectAll').setValue(true);
      } else {
        airline.isChecked = false;
        this.isAllSelected = false;
        this.selectedAirlines = [];
        this.filterForm.get('selectAll').setValue(false);
      }
      this.airlineControls.controls[i].setValue(airline.isChecked, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


interface Airline {
  code: string;
  name: any;
  isChecked: boolean;
  price: number;
}
