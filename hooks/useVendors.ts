import { useState, useEffect, useMemo } from 'react';
import { Vendor, VendorFilters } from '@/types/vendor';
import { vendorsCollection } from '@/data/vendors';
import { useLocation } from '@/contexts/LocationContext';

export function useVendors(filters?: VendorFilters) {
  const [vendors, setVendors] = useState<Vendor[]>(vendorsCollection);
  const [isLoading, setIsLoading] = useState(false);
  const { location, calculateDistance } = useLocation();

  // Calculate distances and sort by proximity
  const vendorsWithDistance = useMemo(() => {
    if (!location || !calculateDistance) {
      return vendors;
    }

    return vendors.map(vendor => {
      const distance = calculateDistance(
        vendor.location.latitude,
        vendor.location.longitude
      );
      return {
        ...vendor,
        calculatedDistance: distance,
      };
    }).sort((a, b) => {
      if (!a.calculatedDistance && !b.calculatedDistance) return 0;
      if (!a.calculatedDistance) return 1;
      if (!b.calculatedDistance) return -1;
      return a.calculatedDistance - b.calculatedDistance;
    });
  }, [vendors, location, calculateDistance]);

  // Apply filters
  const filteredVendors = useMemo(() => {
    if (!filters) return vendorsWithDistance;

    return vendorsWithDistance.filter(vendor => {
      // Category filter
      if (filters.category && vendor.category !== filters.category) {
        return false;
      }

      // Rating filter
      if (filters.rating && vendor.averageRating < filters.rating) {
        return false;
      }

      // Distance filter
      if (filters.distance && vendor.calculatedDistance && vendor.calculatedDistance > filters.distance) {
        return false;
      }

      // Open status filter
      if (filters.isOpen !== undefined && vendor.isOpen !== filters.isOpen) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const vendorPrices = vendor.products.map(p => p.price);
        const minPrice = Math.min(...vendorPrices);
        const maxPrice = Math.max(...vendorPrices);
        
        if (maxPrice < filters.priceRange.min || minPrice > filters.priceRange.max) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          vendor.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Online payment filter
      if (filters.acceptsOnlinePayment !== undefined && 
          vendor.acceptsOnlinePayment !== filters.acceptsOnlinePayment) {
        return false;
      }

      return true;
    });
  }, [vendorsWithDistance, filters]);

  const getVendorById = (id: string): Vendor | undefined => {
    return vendors.find(vendor => vendor.id === id);
  };

  const getFeaturedVendors = (): Vendor[] => {
    return filteredVendors.filter(vendor => vendor.isFeatured);
  };

  const getNearbyVendors = (): Vendor[] => {
    return filteredVendors.filter(vendor => !vendor.isFeatured);
  };

  const getVendorsByCategory = (category: string): Vendor[] => {
    return filteredVendors.filter(vendor => vendor.category === category);
  };

  const searchVendors = (query: string): Vendor[] => {
    const lowercaseQuery = query.toLowerCase();
    return filteredVendors.filter(vendor => 
      vendor.name.toLowerCase().includes(lowercaseQuery) ||
      vendor.description.toLowerCase().includes(lowercaseQuery) ||
      vendor.category.toLowerCase().includes(lowercaseQuery) ||
      vendor.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      vendor.products.some(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
      )
    );
  };

  return {
    vendors: filteredVendors,
    isLoading,
    getVendorById,
    getFeaturedVendors,
    getNearbyVendors,
    getVendorsByCategory,
    searchVendors,
    refreshVendors: () => setVendors([...vendorsCollection]),
  };
}