
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleTransaction {
  id: string;
  moduleId: string;
  userId?: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface ModuleSalesStats {
  totalSales: number;
  totalRevenue: number;
  monthlySales: {
    month: string;
    sales: number;
    revenue: number;
  }[];
  categorySales: {
    category: string;
    sales: number;
    revenue: number;
  }[];
}
