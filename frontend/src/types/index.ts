// User Types
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

// Product Types
export type RentType = 'PER_HOUR' | 'PER_DAY';

export type Category = 
  | 'ELECTRONICS'
  | 'FURNITURE'
  | 'HOME_APPLIANCES'
  | 'SPORTING_GOODS'
  | 'OUTDOOR'
  | 'TOYS';

export type Product = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  price: number;
  rentPrice: number;
  rentType: RentType;
  purchasePrice: number;
  owner: User;
  ownerId: string;
  datePosted: string;
  views: number;
  isAvailable: boolean;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
};

// Transaction Types
export type TransactionType = 'PURCHASE' | 'RENT';

export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export type Transaction = {
  id: string;
  type: TransactionType;
  price: number;
  rentStartDate?: string;
  rentEndDate?: string;
  status: TransactionStatus;
  product: Product;
  productId: string;
  buyer: User;
  buyerId: string;
  seller: User;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
};

// Form Input Types
export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ProductInput = {
  title: string;
  description: string;
  categories: string[];
  price: number;
  rentPrice: number;
  rentType: RentType;
};

// Auth Types
export type AuthPayload = {
  token: string;
  user: User;
};

// Component Props Types
export type ProductFormData = {
  title: string;
  categories: Category[];
  description: string;
  price: number;
  rentPrice: number;
  rentPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY'; // This maps to rentType in backend
};

// Utility Types
export type ApiError = {
  message: string;
  code?: string;
};

// Filter Types
export type ProductFilters = {
  categories: Category[];
  priceRange: {
    min: number;
    max: number;
  };
  rentPriceRange: {
    min: number;
    max: number;
  };
  availability: 'all' | 'available' | 'unavailable';
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rent_low' | 'rent_high';
};

// Navigation Types
export type NavItem = {
  label: string;
  path: string;
  icon?: React.ComponentType;
  requireAuth?: boolean;
};