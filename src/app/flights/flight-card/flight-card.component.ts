import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FlightOffer } from 'src/app/shared/models/flight';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent implements OnInit, OnChanges {
  @Input() flight: FlightOffer;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.flight) {
      console.log('flight offer', this.flight);

    }
  }

  setTimeFromDate(date:Date):void{

  }

}
