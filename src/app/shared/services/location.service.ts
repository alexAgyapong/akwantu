import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { LocationRequest } from './../models/locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocation(request: LocationRequest): Observable<any> {
    const options = new HttpParams({
      fromObject: {
        subType: request.subType,
        keyword: request.keyword
        // view: 'LIGHT'
      }
    });
    const url = `${environment.baseURL}/v1/reference-data/locations`;
    return this.http.get<any>(url, { params: options }).pipe(map(res => res.data));
  }
}
