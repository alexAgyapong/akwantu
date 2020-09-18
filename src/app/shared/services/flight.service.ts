import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestOption } from './../models/flight';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { formatDate } from 'ngx-bootstrap/chronos';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) { }

  getFlightOffers(req: RequestOption): Observable<any> {
    const url = `${environment.baseURL}/v2/shopping/flight-offers`;
    const params = this.setRequestParams(req);
    return this.http.get<any>(url, { params }).pipe(tap(data => {
      console.log({ data });
      localStorage.setItem('offers', JSON.stringify(data));
    }
    ));
  }

  setRequestParams(req: RequestOption): HttpParams {
    const options = new HttpParams({
      fromObject: {
        destinationLocationCode: req.destinationLocationCode,
        originLocationCode: req.originLocationCode,
        departureDate: formatDate(new Date(req.departureDate), 'YYYY-MM-DD'),
        returnDate: formatDate(new Date(req.returnDate), 'YYYY-MM-DD'),
        adults: req?.adults?.toString(),
        children: req?.children?.toString(),
        infants: req?.infants?.toString(),
        travelClass: req?.travelClass,
        // includedAirlineCodes: req?.includedAirlineCodes,
        // excludedAirlineCodes: req.excludedAirlineCodes,
        // nonStop: req.nonStop?.toString(),
        // currencyCode: req.currencyCode,
        // maxPrice: req.maxPrice?.toString(),
        // max: req.max?.toString()
      }
    });

    return options;
  }
}
