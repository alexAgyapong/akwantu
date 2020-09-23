
export interface FilterParam{
  includedAirlineCodes?: string;
  airlines?: string;
  excludedAirlineCodes?: string;
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
}

export interface SearchParam extends FilterParam{
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  tripType: string;
  travelClass: string;
  adults: number;
  children: number;
  infants: number;
}
