export type AdStatus = "active" | "expired";

export interface ExternalAd {
  id: string;
  entityName: string;
  entityType: string;
  subscriptionDate: string;
  adStart: string;
  adEnd: string;
  status: AdStatus;
  images: string[];
}
