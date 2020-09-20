import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { SearchParam } from './../../shared/models/search-param';
import { RequestOption, FlightResponse, FlightOffer } from './../../shared/models/flight';
import { FlightService } from './../../shared/services/flight.service';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {
  searchTerms: SearchParam;
  offers$ = new Observable<FlightOffer[]>();


  constructor(private route: ActivatedRoute, private flightService: FlightService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerms = { ...params } as SearchParam;
      let req = {
        destinationLocationCode: this.searchTerms.destination,
        originLocationCode: this.searchTerms.origin,
        departureDate: this.searchTerms.departureDate,
        returnDate: this.searchTerms.returnDate,
        adults: this.searchTerms.adults,
        children: this.searchTerms.children,
        infants: this.searchTerms.infants,
        travelClass: this.searchTerms.travelClass
      } as RequestOption;
      // this.getFlightOffers(req);
      this.getTestData();
      console.log(this.searchTerms, 'param map');
    });
  }

  getFlightOffers(req: RequestOption): void {
    this.offers$ = this.flightService.getFlightOffers(req).pipe(map(res => res.data));
  }

  getTestData(): void {
    const res = localStorage.getItem('offers');
    const response = JSON.parse(res) as FlightResponse;
    const { data } = response;
    this.offers$ = of(data);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}
