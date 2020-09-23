import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dictionaries, FlightOffer, FlightResponse } from 'src/app/shared/models/flight';
import lodash from 'lodash';
import { Options, LabelType } from 'ng5-slider';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() flights: FlightOffer[] = [];
  filterForm: FormGroup;
  isCollapsed = true;
  isMaxPriceCollapsed = true;
  isAirlinesCollapsed = true;
  isCurrencyCollapsed = true;
  dictionaries: Dictionaries;
  airlines: Airline[] = [];
  airlineCodes: string[] = [];
  airlinesWithPrices: { code: string, price: number }[] = [];

  options: Options = {
    floor: 200,
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
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setAirlinesFares();
  }

  ngOnInit(): void {
    this.setupForm();
    this.getAirlines();
    this.setAirlinesFares();
    this.formChanges();
  }

  formChanges(): void {
    this.filterForm.valueChanges.pipe(debounceTime(1000)).subscribe(input => {
      if (input) {
        const airlines = Object.values(this.airlineCodes)?.toString();
        const filters = { ...input, airlines };
        this.sendFilters(filters);
      }
    });
  }

  sendFilters(input: any): void {
    this.router.navigate(['/flights'], { queryParams: input, queryParamsHandling: 'merge' });
  }

  private setupForm(): void {
    this.filterForm = this.fb.group({
      stops: [''],
      airlines: [''],
      maxPrice: [''],
      currency: ['GBP']
      // cabin: [''],
      // checkedBag: [''],
      // paymentMethod: ['']
    });
  }

  private getDictionaries(): void {
    const res = localStorage.getItem('offers');
    const response = JSON.parse(res) as FlightResponse;
    const { dictionaries } = response;
    this.dictionaries = dictionaries;
  }

  getAirlines(): void {
    this.getDictionaries();
    const keys = Object.keys(this.dictionaries.carriers);
    keys.forEach(key => {
      const airline = { code: key, name: this.dictionaries.carriers[key], isChecked: false, price: 0 };
      if (airline) { this.airlines.push(airline); }
    });
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
    console.log('with price', this.airlinesWithPrices, 'original', this.airlines);
  }

  getAirlineCodes(key: string): void {
    if (this.airlineCodes.some(x => x === key)) {
      this.airlineCodes.splice(this.airlineCodes.findIndex(x => x === key), 1);
    } else { this.airlineCodes?.push(key); }
  }

  getAirlinePrice = (airlines: Airline[], prices: { code: string, price: number }[]) => {
    airlines?.forEach(airline => prices?.forEach(p => { if (airline.code === p.code) { airline.price = p.price; } }));
  }
}


interface Airline {
  code: string;
  name: any;
  isChecked: boolean;
  price: number;
}
