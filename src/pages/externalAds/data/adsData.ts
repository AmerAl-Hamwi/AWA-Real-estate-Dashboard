import { ExternalAd } from "@/types/externalAd";

export const dummyAds: ExternalAd[] = [
  {
    id: "ad1",
    entityName: "Acme Corporation",
    entityType: "Company",
    subscriptionDate: "2025-04-10",
    adStart: "2025-05-01T09:00:00",
    adEnd:   "2025-05-31T18:00:00",
    status: "active",
    images: ["/ads/acme-main.jpg", "/ads/acme-1.jpg", "/ads/acme-2.jpg"],
  },
  {
    id: "ad2",
    entityName: "Sunrise Café",
    entityType: "Restaurant",
    subscriptionDate: "2025-03-20",
    adStart: "2025-04-01T08:00:00",
    adEnd:   "2025-04-30T20:00:00",
    status: "expired",
    images: ["/ads/sunrise-main.jpg", "/ads/sunrise-1.jpg"],
  },
  // …add more as needed
];
