export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface CategoriesState {
  categories: Category[];
  subCategories: SubCategory[];
  loading: boolean;
  error: string | null;
}
