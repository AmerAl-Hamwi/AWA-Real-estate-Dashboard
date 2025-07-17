export interface BannerPayload {
  id?: string;
  type: "text" | "image";
  title?: string;
  body?: string;
  imageFile?: File;
}

export interface FormattedBanner {
  id: string;
  imageUrl: string;
  title: string | null;
  body: string | null;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerData {
  banners: FormattedBanner[];
  page: number;
  totalPages: number;
  totalBanners: number;
}

export interface BannerResponse {
  status: boolean;
  message: string;
  data: BannerData;
}
