import { Column } from "@components/ui/table/TableLayouts";
import { Ad, CommonAd, AdRequire } from "@/types/property";

const sharedColumns: Column<CommonAd>[] = [
  { field: "type", label: "Estate Type", minWidth: 100 },
  { field: "description[ar]", label: "Description (AR)", minWidth: 200 },
  { field: "ownershipType", label: "Ownership Type", minWidth: 120 },
  { field: "furnishingType", label: "Furnishing Type", minWidth: 120 },
  { field: "orientation", label: "Orientation", minWidth: 100 },
  { field: "category[ar]", label: "Category (AR)", minWidth: 100 },
  { field: "menities", label: "Amenities", minWidth: 150 },
  { field: "TypeAccepte", label: "Status", minWidth: 100 },
  { field: "user", label: "User", minWidth: 100 },
];

export const saleColumns: Column<Ad>[] = [
  ...sharedColumns,
  { field: "adType", label: "Ad Type", minWidth: 100 },
  { field: "rooms", label: "Rooms", minWidth: 60, numeric: true },
  { field: "floors", label: "Floors", minWidth: 60, numeric: true },
  { field: "floorNumber", label: "Floor #", minWidth: 60, numeric: true },
  { field: "area", label: "Area (msq)", minWidth: 70 },
  { field: "priceSYP", label: "Price (SYP)", minWidth: 90, numeric: true },
  { field: "priceUSD", label: "Price (USD)", minWidth: 90, numeric: true },
];

export const rentColumns: Column<Ad>[] = [
  ...sharedColumns,
  { field: "adType", label: "Ad Type", minWidth: 100 },
  { field: "rooms", label: "Rooms", minWidth: 60, numeric: true },
  { field: "floors", label: "Floors", minWidth: 60, numeric: true },
  { field: "floorNumber", label: "Floor #", minWidth: 60, numeric: true },
  { field: "area", label: "Area (msq)", minWidth: 70 },
  { field: "rentalPeriods", label: "Rental Periods", minWidth: 200 },
];

export const requireColumns: Column<AdRequire>[] = [
  { field: "type", label: "Estate Type", minWidth: 100 },
  { field: "TypeAccepte", label: "Status", minWidth: 100 },
  { field: "number", label: "Phone Number", minWidth: 120 },
  { field: "description[en]", label: "Description (EN)", minWidth: 250 },
  { field: "description[ar]", label: "Description (AR)", minWidth: 250 },
  { field: "Minprice", label: "Min Price (SYP)", minWidth: 100, numeric: true },
  { field: "Maxprice", label: "Max Price (SYP)", minWidth: 100, numeric: true },
  { field: "province", label: "Province", minWidth: 150 },
  { field: "category[en]", label: "Category (EN)", minWidth: 150 },
  { field: "category[ar]", label: "Category (AR)", minWidth: 150 },
];
