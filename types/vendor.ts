export interface VendorLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot';
  tags?: string[];
}

export interface VendorRating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  date: string;
  images?: string[];
}

export interface VendorHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  images: string[];
  location: VendorLocation;
  products: VendorProduct[];
  ratings: VendorRating[];
  averageRating: number;
  totalRatings: number;
  isOpen: boolean;
  estimatedTime: string;
  specialOffers?: string[];
  tags: string[];
  phoneNumber?: string;
  whatsappNumber?: string;
  businessHours: VendorHours[];
  isVerified: boolean;
  isFeatured: boolean;
  joinedDate: string;
  lastActive: string;
  deliveryRadius: number; // in kilometers
  minimumOrder?: number;
  deliveryFee?: number;
  acceptsOnlinePayment: boolean;
  paymentMethods: string[];
}

export interface VendorFilters {
  category?: string;
  rating?: number;
  distance?: number;
  isOpen?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  acceptsOnlinePayment?: boolean;
}