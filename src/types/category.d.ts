export interface Category {
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