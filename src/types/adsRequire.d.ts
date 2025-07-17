export interface Province {
  _id: string;
  name: string;
}

// Ad type
export interface AdRequire {
  id: string;
  type: "Rent" | "Sale";
  TypeAccepte: "approved" | "wait";
  number: string;
  "description[en]": string;
  "description[ar]": string;
  Minprice: number;
  Maxprice: number;
  province: Province;
  "category[en]": string;
  "category[ar]": string;
}

// Data for the response
export interface AdsData {
  ads: AdRequire[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
}

// Full response type
export interface AdsRequireResponse {
  status: boolean;
  message: string;
  data: AdsData;
}