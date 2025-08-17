// src/components/data/columnDefs.ts
import { Column } from "@components/ui/table/TableLayouts";
import { Ad, CommonAd, AdRequire } from "@/types/property";

interface LocalizedColumn<T> extends Omit<Column<T>, "label"> {
  labelEn: string;
  labelAr: string;
}

export const sharedColumns: LocalizedColumn<CommonAd>[] = [
  {
    field: "type",
    labelEn: "Estate Type",
    labelAr: "نوع العقار",
    minWidth: 100,
  },
  {
    field: "description[ar]",
    labelEn: "Description (AR)",
    labelAr: "الوصف (عربي)",
    minWidth: 200,
  },
  {
    field: "ownershipType",
    labelEn: "Ownership Type",
    labelAr: "نوع الملكية",
    minWidth: 120,
  },
  {
    field: "furnishingType",
    labelEn: "Furnishing Type",
    labelAr: "نوع التأثيث",
    minWidth: 120,
  },
  {
    field: "orientation",
    labelEn: "Orientation",
    labelAr: "الاتجاه",
    minWidth: 100,
  },
  {
    field: "category[ar]",
    labelEn: "Category (AR)",
    labelAr: "الفئة (عربي)",
    minWidth: 100,
  },
  {
    field: "menities",
    labelEn: "Amenities",
    labelAr: "المرافق",
    minWidth: 150,
  },
  { field: "TypeAccepte", labelEn: "Status", labelAr: "الحالة", minWidth: 100 },
  { field: "user", labelEn: "User", labelAr: "المستخدم", minWidth: 100 },
];

export const saleColumns: LocalizedColumn<Ad>[] = [
  ...sharedColumns,
  {
    field: "adType",
    labelEn: "Ad Type",
    labelAr: "نوع الإعلان",
    minWidth: 100,
  },
  {
    field: "rooms",
    labelEn: "Rooms",
    labelAr: "غرف",
    minWidth: 60,
    numeric: true,
  },
  {
    field: "floors",
    labelEn: "Floors",
    labelAr: "طوابق",
    minWidth: 60,
    numeric: true,
  },
  {
    field: "floorNumber",
    labelEn: "Floor #",
    labelAr: "رقم الطابق",
    minWidth: 60,
    numeric: true,
  },
  {
    field: "area",
    labelEn: "Area (m²)",
    labelAr: "المساحة (م²)",
    minWidth: 70,
  },
  {
    field: "priceSYP",
    labelEn: "Price (SYP)",
    labelAr: "السعر (ل.س)",
    minWidth: 90,
    numeric: true,
  },
  {
    field: "priceUSD",
    labelEn: "Price (USD)",
    labelAr: "السعر (USD)",
    minWidth: 90,
    numeric: true,
  },
];

export const rentColumns: LocalizedColumn<Ad>[] = [
  ...sharedColumns,
  {
    field: "adType",
    labelEn: "Ad Type",
    labelAr: "نوع الإعلان",
    minWidth: 100,
  },
  {
    field: "rooms",
    labelEn: "Rooms",
    labelAr: "غرف",
    minWidth: 60,
    numeric: true,
  },
  {
    field: "floors",
    labelEn: "Floors",
    labelAr: "طوابق",
    minWidth: 60,
    numeric: true,
  },
  {
    field: "floorNumber",
    labelEn: "Floor #",
    labelAr: "رقم الطابق",
    minWidth: 60,
    numeric: true,
  },
  {
    field: "area",
    labelEn: "Area (m²)",
    labelAr: "المساحة (م²)",
    minWidth: 70,
  },
  {
    field: "rentalPeriods",
    labelEn: "Rental Periods",
    labelAr: "فترات الإيجار",
    minWidth: 200,
  },
];

export const requireColumns: LocalizedColumn<AdRequire>[] = [
  {
    field: "type",
    labelEn: "Estate Type",
    labelAr: "نوع العقار",
    minWidth: 100,
  },
  { field: "TypeAccepte", labelEn: "Status", labelAr: "الحالة", minWidth: 100 },
  {
    field: "number",
    labelEn: "Phone Number",
    labelAr: "رقم الهاتف",
    minWidth: 120,
  },
  {
    field: "description[en]",
    labelEn: "Description (EN)",
    labelAr: "الوصف (إنجليزي)",
    minWidth: 250,
  },
  {
    field: "description[ar]",
    labelEn: "Description (AR)",
    labelAr: "الوصف (عربي)",
    minWidth: 250,
  },
  {
    field: "Minprice",
    labelEn: "Min Price (SYP)",
    labelAr: "الحد الأدنى (ل.س)",
    minWidth: 100,
    numeric: true,
  },
  {
    field: "Maxprice",
    labelEn: "Max Price (SYP)",
    labelAr: "الحد الأقصى (ل.س)",
    minWidth: 100,
    numeric: true,
  },
  {
    field: "province",
    labelEn: "Province",
    labelAr: "المحافظة",
    minWidth: 150,
  },
  {
    field: "category[en]",
    labelEn: "Category (EN)",
    labelAr: "الفئة (إنجليزي)",
    minWidth: 150,
  },
  {
    field: "category[ar]",
    labelEn: "Category (AR)",
    labelAr: "الفئة (عربي)",
    minWidth: 150,
  },
];
