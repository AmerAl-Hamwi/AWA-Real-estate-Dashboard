import { useLanguage } from "@/contexts/language/LanguageContext";
import type { Column } from "@components/ui/table/TableLayouts";

/**
 * Accepts an array of defs that are "Column<T> minus its `label`" plus `labelEn` & `labelAr`.
 * Returns a true Column<T>[] where .label is filled in from the current language.
 */
export function useLocalizedColumns<T>(
  defs: Array<Omit<Column<T>, "label"> & { labelEn: string; labelAr: string }>
): Column<T>[] {
  const { lang } = useLanguage();
  return defs.map(({ labelEn, labelAr, ...rest }) => ({
    ...rest,
    label: lang === "ar" ? labelAr : labelEn,
  }));
}