
export interface Links {
  self: string;
}

export interface Meta {
  count: number;
  links: Links;
}

export interface Departure {
  iataCode: string;
  terminal: string;
  at: Date;
}

export interface Arrival {
  iataCode: string;
  terminal: string;
  at: Date;
}

export interface Aircraft {
  code: string;
}

export interface Operating {
  carrierCode: string;
}

export interface Segment {
  departure: Departure;
  arrival: Arrival;
  carrierCode: string;
  carrierName?: string;
  number: string;
  aircraft: Aircraft;
  operating: Operating;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Fee {
  amount: string;
  type: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface Price2 {
  currency: string;
  total: string;
  base: string;
}

export interface IncludedCheckedBags {
  weight: number;
  weightUnit: string;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: IncludedCheckedBags;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price2;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface DMK {
  cityCode: string;
  countryCode: string;
}

export interface SIN {
  cityCode: string;
  countryCode: string;
}

export interface SYD {
  cityCode: string;
  countryCode: string;
}

export interface Locations {
  DMK: DMK;
  SIN: SIN;
  SYD: SYD;
}

export interface Aircraft2 {
  // 789: string;
  //     77W: string;
}

export interface Currencies {
  EUR: string;
}

export interface Carriers {
  TR: string;
}

export interface Dictionaries {
  locations: Locations;
  aircraft: Aircraft2;
  currencies: Currencies;
  carriers: Carriers;
}

export interface FlightResponse {
  meta: Meta;
  data: FlightOffer[];
  dictionaries: Dictionaries;
}







export interface RequestOption {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string;
  includedAirlineCodes?: string;
  excludedAirlineCodes?: string;
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
}