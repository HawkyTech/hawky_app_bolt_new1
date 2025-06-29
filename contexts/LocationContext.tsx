import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';

interface LocationContextType {
  location: Location.LocationObject | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  calculateDistance: (lat: number, lng: number) => number | null;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Request location on app load
    requestLocation();
  }, []);

  const requestLocation = async () => {
    if (Platform.OS === 'web') {
      // For web platform, use browser geolocation API
      await requestWebLocation();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request foreground permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied');
        setIsLoading(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(currentLocation);

      // Get address from coordinates
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const addressData = reverseGeocode[0];
          const formattedAddress = [
            addressData.street,
            addressData.district,
            addressData.city,
            addressData.region
          ].filter(Boolean).join(', ');
          
          setAddress(formattedAddress || 'Unknown location');
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
        setAddress('Location found');
      }

    } catch (locationError) {
      console.error('Location error:', locationError);
      setError('Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  const requestWebLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const webLocation: Location.LocationObject = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        },
        timestamp: position.timestamp,
      };

      setLocation(webLocation);
      setAddress('Current location'); // Simplified for web

    } catch (webError) {
      console.error('Web location error:', webError);
      setError('Failed to get location');
      // Set default location for development
      setLocation({
        coords: {
          latitude: 12.9716,
          longitude: 77.5946,
          altitude: null,
          accuracy: 100,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
      setAddress('Bengaluru, Karnataka');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = async () => {
    await requestLocation();
  };

  const calculateDistance = (lat: number, lng: number): number | null => {
    if (!location) return null;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat - location.coords.latitude);
    const dLon = deg2rad(lng - location.coords.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(location.coords.latitude)) *
        Math.cos(deg2rad(lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const value: LocationContextType = {
    location,
    address,
    isLoading,
    error,
    requestLocation,
    calculateDistance,
    refreshLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}