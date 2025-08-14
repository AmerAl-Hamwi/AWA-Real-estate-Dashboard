export interface Category {
  thumbnailUrl: any;
  id: string;
  "name[en]": string;
  "name[ar]": string;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: {
    categories: Category[];
    totalCategories: number;
  };
}