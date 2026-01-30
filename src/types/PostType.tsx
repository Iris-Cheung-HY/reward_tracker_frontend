export interface FrontendPost {
  id: number;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  imageUrl: string;
  isFeatured: boolean;
  userId: number;
}