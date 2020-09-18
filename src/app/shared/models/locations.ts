
export interface Links {
  self: string;
  next: string;
  last: string;
}

export interface Meta {
  count: number;
  links: Links;
}

export interface Self {
  href: string;
  methods: string[];
}

export interface GeoCode {
  latitude: number;
  longitude: number;
}

export interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  stateCode: string;
  regionCode: string;
}

export interface Travelers {
  score: number;
}

export interface Analytics {
  travelers: Travelers;
}

export interface LocationData {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: Self;
  timeZoneOffset: string;
  iataCode: string;
  geoCode: GeoCode;
  address: Address;
  analytics: Analytics;
}

export interface LocationRequest {
  subType: string;
  keyword: string;
  countryCode: string;
  view: string;
}

export interface LocationsResponse {
  meta: Meta;
  data: LocationData[];
}
