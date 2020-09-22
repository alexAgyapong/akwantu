import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dictionaries, FlightOffer, FlightResponse } from 'src/app/shared/models/flight';

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
  airlines: Map<string, any>;
  airlineCodes: string[] = [];

  constructor(private fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    //  this.setAirlinesFares()
  }

  ngOnInit(): void {
    this.setupForm();
    this.getAirlines();
    this.setAirlinesFares()
    // this.formChanges();
  }

  formChanges() {
    this.filterForm.valueChanges.subscribe(input => console.log({ input })
    )
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

  getAirlines() {

    this.getDictionaries();
    let airlinesMap = new Map(Object.entries(this.dictionaries.carriers));
    this.airlines = airlinesMap;
    // console.log({ airlinesMap });

  }

  setAirlinesFares() {
    // console.log('airlines', this.flights);
    let output: { code: string, price: number }[] = [];
    let validCodes = this.flights.filter(x => x).map(v => v.validatingAirlineCodes);
    this.flights.forEach(flight => {
      const { validatingAirlineCodes, price } = flight;
      let res = { code: validatingAirlineCodes[0], price: +price.grandTotal }
      output.push(res);
      // if(!output.some(x=>x.code===res.code)) {
      // }
    })
   let test  = output.filter(x=>x.code).map(p=>p.price);
   console.log({test});

    // let test = Math.min.apply(null, output.filter(x=>x).map(p=>+p.price))
    // console.log({output}, {test});

  }

  getAirlineCodes(key: string): void {

    if (this.airlineCodes.some(x => x === key)) {
      this.airlineCodes.splice(this.airlineCodes.findIndex(x => x === key), 1);
    } else { this.airlineCodes?.push(key); }
    // console.log({ key }, 'all keys', this.airlineCodes);
  }
}
