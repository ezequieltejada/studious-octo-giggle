export interface Response {
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: string;
  creationDate: string; // ISO Date
  title: string;
  url: string;
  price: Price;
  seller: Seller;
  km?: number;
  year: number;
  provinceIds: number[];
  mainProvince: string;
  location: Location;
  resources: Resource[];
  makeId: number;
  modelId: number;
  fuelTypeId: number;
  fuelType: FuelType;
  isFinanced: boolean;
  isCertified: boolean;
  isProfessional: boolean;
  publishedDate: string; // ISO Date
  hasUrge: boolean;
  offerType: OfferType;
  phone: string;
  contractId: string;
  cubicCapacity?: number;
  bodyTypeId?: number;
  warranty?: Warranty;
  pack?: Pack;
}

export enum FuelType {
  Eléctrico = "Eléctrico",
  Gasolina = "Gasolina",
}

export interface Location {
  provinceIds: number[];
  mainProvince: string;
  mainProvinceId: number;
  cityId?: number;
  cityLiteral?: string;
}

export interface OfferType {
  id: number;
  literal: Literal;
}

export enum Literal {
  Nuevo = "Nuevo",
  Ocasión = "Ocasión",
}

export interface Pack {
  legacyId: number;
  type: PackType;
}

export enum PackType {
  Advance = "advance",
  Discover = "discover",
  Reference = "reference",
  Start = "start",
}

export interface Price {
  amount: number;
}

export interface Resource {
  type: ResourceType;
  url: string;
}

export enum ResourceType {
  Image = "IMAGE",
}

export interface Seller {
  name: string;
  isProfessional: boolean;
  contractId: string;
  pack?: Pack;
}

export interface Warranty {
  literal: string;
}

export interface Meta {
  totalPages: number;
  totalResults: number;
}
