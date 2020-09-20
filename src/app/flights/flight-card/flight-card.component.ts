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
      this.setValidatingAirlineNames(this.flight);
      this.setNumberOfStops(this.flight);
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
      });
    });

  }

  setValidatingAirlineNames(flight: FlightOffer): void {
    const airlines = [];
    this.getDictionaries();
    flight.validatingAirlineCodes.forEach(i => {
      const name = this.dictionaries?.carriers[i];
      if (name) { airlines.push(name); }
      flight.validatingAirlineNames = airlines;
      console.log({ airline: airlines });
    });
  }

  setNumberOfStops(flight: FlightOffer): void {

    const outboundTotal = flight?.itineraries[0]?.segments?.length - 1;
    const inboundTotal = flight?.itineraries[flight?.itineraries?.length - 1]?.segments?.length - 1;
    const outboundChanges = outboundTotal > 0 ? outboundTotal === 1 ? `${outboundTotal} stop` : `${outboundTotal} stops` : 'NonStop';
    const inboundChanges = inboundTotal > 0 ? inboundTotal === 1 ? `${inboundTotal} stop` : `${inboundTotal} stops` : 'NonStop';
    flight.outboundChanges = outboundChanges;
    flight.inboundChanges = inboundChanges;

    // flight.itineraries.forEach(i => {
    //   // let outBoundStops = outbounds.reduce((a, b) => a + b, 0);
    //   // let outbounds = i.segments.filter(x => x.departure.iataCode).map(x => x.numberOfStops);
    //   // let inbounds = i.segments.filter(x => x.arrival.iataCode).map(x => x.numberOfStops);
    //   // let outBoundStops = outbounds.reduce((a, b) => a + b, 0);
    //   const outboundChanges = i.segments.filter(x => x.departure.iataCode).length - 1;
    //   const inboundChanges = i.segments.filter(x => x.arrival.iataCode).length - 1;
    //   console.log({ outboundChanges }, { inboundChanges });
    // })
  }
}
