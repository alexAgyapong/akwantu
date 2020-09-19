import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Dictionaries, FlightOffer, FlightResponse } from 'src/app/shared/models/flight';
import * as moment from 'moment';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent implements OnInit, OnChanges {
  @Input() flight: FlightOffer;
  dictionaries: Dictionaries;
  constructor() { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.flight) {
      console.log('flight offer', this.flight);
      this.setCarrierName(this.flight);
    }
  }
  private getDictionaries(): void {
    const res = localStorage.getItem('offers');
    const response = JSON.parse(res) as FlightResponse;
    const { dictionaries } = response;
    this.dictionaries = dictionaries;
  }

  setCarrierName(flight: FlightOffer): void {
    this.getDictionaries();
    flight.itineraries.forEach(i => {
      i.segments.forEach(s => {

        const carrier = this.dictionaries?.carriers[s.carrierCode];
        s.carrierName = carrier;
        console.log({ carrier });
      });
    });
    console.log('keys', Object.keys(this.dictionaries?.carriers));
    console.log('test', this.dictionaries?.carriers);

  }

}
