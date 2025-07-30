export interface Module {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'business' | 'personal' | 'creative' | 'productivity';
  featuredImage: string;
  rating: number;
  sales: number;
  isInstalled: boolean;
  isNew: boolean;
}