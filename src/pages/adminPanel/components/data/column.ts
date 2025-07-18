import { Column } from "@components/ui/table/TableLayouts";
import { Ad, CommonAd, AdRequire } from "@/types/property";

export const getSharedColumns = (lang: "en" | "ar"): Column<CommonAd>[] => [
  { field: "type", label: lang === "ar" ? "نوع العقار" : "Estate Type", minWidth: 100 },
  { field: `description[${lang}]`, label: lang === "ar" ? "الوصف" : "Description", minWidth: 200 },
  { field: "ownershipType", label: lang === "ar" ? "نوع الملكية" : "Ownership Type", minWidth: 120 },
  { field: "furnishingType", label: lang === "ar" ? "نوع التأثيث" : "Furnishing Type", minWidth: 120 },
  { field: "orientation", label: lang === "ar" ? "الاتجاه" : "Orientation", minWidth: 100 },
  { field: `category[${lang}]`, label: lang === "ar" ? "الفئة" : "Category", minWidth: 100 },
  { field: "menities", label: lang === "ar" ? "المرافق" : "Amenities", minWidth: 150 },
  { field: "TypeAccepte", label: lang === "ar" ? "الحالة" : "Status", minWidth: 100 },
  { field: "user", label: lang === "ar" ? "المستخدم" : "User", minWidth: 100 },
];

export const getSaleColumns = (lang: "en" | "ar"): Column<Ad>[] => [
  ...getSharedColumns(lang),
  { field: "adType", label: lang === "ar" ? "نوع الإعلان" : "Ad Type", minWidth: 100 },
  { field: "rooms", label: lang === "ar" ? "الغرف" : "Rooms", minWidth: 60, numeric: true },
  { field: "floors", label: lang === "ar" ? "الطوابق" : "Floors", minWidth: 60, numeric: true },
  { field: "floorNumber", label: lang === "ar" ? "الطابق" : "Floor #", minWidth: 60, numeric: true },
  { field: "area", label: lang === "ar" ? "المساحة (م²)" : "Area (msq)", minWidth: 70 },
  { field: "priceSYP", label: lang === "ar" ? "السعر (ل.س)" : "Price (SYP)", minWidth: 90, numeric: true },
  { field: "priceUSD", label: lang === "ar" ? "السعر ($)" : "Price (USD)", minWidth: 90, numeric: true },
];

export const getRentColumns = (lang: "en" | "ar"): Column<Ad>[] => [
  ...getSharedColumns(lang),
  { field: "adType", label: lang === "ar" ? "نوع الإعلان" : "Ad Type", minWidth: 100 },
  { field: "rooms", label: lang === "ar" ? "الغرف" : "Rooms", minWidth: 60, numeric: true },
  { field: "floors", label: lang === "ar" ? "الطوابق" : "Floors", minWidth: 60, numeric: true },
  { field: "floorNumber", label: lang === "ar" ? "الطابق" : "Floor #", minWidth: 60, numeric: true },
  { field: "area", label: lang === "ar" ? "المساحة (م²)" : "Area (msq)", minWidth: 70 },
  { field: "rentalPeriods", label: lang === "ar" ? "فترات الإيجار" : "Rental Periods", minWidth: 200 },
];

export const getRequireColumns = (lang: "en" | "ar"): Column<AdRequire>[] => [
  { field: "type", label: lang === "ar" ? "نوع العقار" : "Estate Type", minWidth: 100 },
  { field: "TypeAccepte", label: lang === "ar" ? "الحالة" : "Status", minWidth: 100 },
  { field: "number", label: lang === "ar" ? "رقم الهاتف" : "Phone Number", minWidth: 120 },
  { field: `description[${lang}]`, label: lang === "ar" ? "الوصف" : "Description", minWidth: 250 },
  { field: "Minprice", label: lang === "ar" ? "الحد الأدنى للسعر" : "Min Price (SYP)", minWidth: 100, numeric: true },
  { field: "Maxprice", label: lang === "ar" ? "الحد الأقصى للسعر" : "Max Price (SYP)", minWidth: 100, numeric: true },
  { field: "province", label: lang === "ar" ? "المحافظة" : "Province", minWidth: 150 },
  { field: `category[${lang}]`, label: lang === "ar" ? "الفئة" : "Category", minWidth: 150 },
];
