import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { SearchParam } from './../../shared/models/search-param';
import { RequestOption, FlightResponse, FlightOffer } from './../../shared/models/flight';
import { FlightService } from './../../shared/services/flight.service';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BreakpointService } from './../../shared/services/breakpoint.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {
  searchTerms: SearchParam;
  offers$ = new Observable<FlightOffer[]>();
  modalRef: BsModalRef;
  isMinTablet = false;
  // dialog: MatDialog;

  constructor(private route: ActivatedRoute,
    private bsModalService: BsModalService,
    private breakpointService: BreakpointService,
    private flightService: FlightService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isMinTablet = this.breakpointService.isTabletBreakPoint();
    this.route.queryParams.subscribe((params) => {
      this.searchTerms = { ...params } as SearchParam;
      const req = {
        destinationLocationCode: this.searchTerms.destination,
        originLocationCode: this.searchTerms.origin,
        departureDate: this.searchTerms.departureDate,
        returnDate: this.searchTerms.returnDate,
        adults: this.searchTerms.adults,
        children: this.searchTerms.children,
        infants: this.searchTerms.infants,
        travelClass: this.searchTerms.travelClass,
        nonStop: this.searchTerms.nonStop,
        // includedAirlineCodes:  this.searchTerms.airlines,
        // excludedAirlineCodes: this.searchTerms.excludedAirlineCodes,
        currencyCode: this.searchTerms.currencyCode,
        maxPrice: this.searchTerms.maxPrice
      } as RequestOption;
      console.log({ req }, 'search params', this.searchTerms);

      // if (req?.destinationLocationCode) {
      //   this.getFlightOffers(req);
      // }
      this.getTestData();
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

  getSearchTermsForMobile(searchParams: SearchParam): void {
    if (searchParams) { this.modalRef.hide(); }
  }

  showSearchModal(template: TemplateRef<any>): void {
    this.modalRef = this.bsModalService.show(template, Object.assign({}, { class: 'modal-sm' }));
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  showFiltersModal(template: TemplateRef<any>): void {
    this.dialog.open(template,
      {
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // width: '100%'
        panelClass: ['full-screen-modal']
      }
      );
  }

  resetFilters():void{
    
  }
}
