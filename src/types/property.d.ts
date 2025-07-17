export interface CommonAd {
  type: string;
  TypeAccepte: string;
  "description[en]": string;
  "description[ar]": string;
  "category[en]": string;
  "category[ar]": string;
  ownershipType: string;
  furnishingType: string;
  orientation: string;
  menities: string[];
  user: string;
  categoryid: string[];
  province: string[];
  amenitiesid: string[];
}

export interface AdRequire extends CommonAd {
  id: string;
  number: string;
  Minprice: number;
  Maxprice: number;
  province: Province;
}

export interface RentalPeriod {
  period: string;
  priceSYP: number;
  priceUSD: number;
  _id: string;
}

export interface ImageFile {
  id: string;
  url: string;
}

export interface Ad extends CommonAd {
  id: string;
  adType: string;
  rooms: number;
  floors: number;
  floorNumber: number;
  area: number;
  priceSYP: number;
  priceUSD: number;
  rentalPeriods: RentalPeriod[];
  adImage: ImageFile[]; 
}

export interface AdsResponseData {
  ads: Ad[] & AdRequire[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
}

export interface AdsResponse {
  status: boolean;
  message: string;
  data: AdsResponseData;
}
