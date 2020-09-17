import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocation(searchTerm: string): Observable<any> {
    const options = new HttpParams({
      fromObject: {
        subType: 'City, Airport',
        keyword: searchTerm
        // view: 'LIGHT'
      }
    });
    const url = `${environment.baseURL}/v1/reference-data/locations`;
    return this.http.get<any>(url, { params: options });
  }
}
