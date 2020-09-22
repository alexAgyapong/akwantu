import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dictionaries, FlightOffer, FlightResponse } from 'src/app/shared/models/flight';
import lodash from 'lodash';
import { Options,LabelType } from 'ng5-slider';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() flights: FlightOffer[] = [];
  filterForm: FormGroup;
  isCollapsed = true;
  isDepTimesCollapsed = true;
  isAirlinesCollapsed = true;
  dictionaries: Dictionaries;
  airlines: Airline[] = [];
  airlineCodes: string[] = [];
  airlinesWithPrices: { code: string, price: number }[] = [];
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 5,
    showSelectionBar: true,
    getPointerColor: (value: number): string => {
        // if (value <= 3) {
        //     return 'red';
        // }
        // if (value <= 6) {
        //     return 'orange';
        // }
        // if (value <= 9) {
        //     return 'yellow';
        // }
        return '#808080';
    },
    getSelectionBarColor: (value: number): string => {
      // if (value <= 3) {
      //     return 'red';
      // }
      // if (value <= 6) {
      //     return 'orange';
      // }
      // if (value <= 9) {
      //     return 'yellow';
      // }
      return '#808080';
    }
  };

  dateRange: Date[] = this.createDateRange();
  value: number = this.dateRange[0].getTime();
  // options: Options = {
  //   stepsArray: this.dateRange.map((date: Date) => {
  //     return { value: date.getTime() };
  //   }),
  //   translate: (value: number, label: LabelType): string => {
  //     return new Date(value).toDateString();
  //   }
  // };

  createDateRange(): Date[] {
    const dates: Date[] = [];
    for (let i: number = 1; i <= 31; i++) {
      dates.push(new Date(2018, 5, i));
    }
    return dates;
  }
  constructor(private fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.setAirlinesFares();
  }

  ngOnInit(): void {
    this.setupForm();
    this.getAirlines();
    this.setAirlinesFares();
    // this.formChanges();
  }

  formChanges() {
    this.filterForm.valueChanges.subscribe(input => console.log({ input })
    );
  }



  private setupForm(): void {
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

  private getDictionaries(): void {
    const res = localStorage.getItem('offers');
    const response = JSON.parse(res) as FlightResponse;
    const { dictionaries } = response;
    this.dictionaries = dictionaries;
  }

  getFlightStops(flights: FlightOffer[]) {
    const outboundTotal = flights[0]?.itineraries[0]?.segments?.length - 1;
    const inboundTotal = flights[0]?.itineraries[flights[0]?.itineraries?.length - 1]?.segments?.length - 1;
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
    airlines?.forEach(x => {
      prices?.forEach(p => {
        if (x.code === p.code) { x.price = p.price; }
      });
    });
  }
}


interface Airline {
  code: string;
  name: any;
  isChecked: boolean;
  price: number;
}