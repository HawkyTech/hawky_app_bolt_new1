import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '@/contexts/CartContext';

interface CartBadgeProps {
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

export default function CartBadge({ style, size = 'medium' }: CartBadgeProps) {
  const { totalItems } = useCart();

  if (totalItems === 0) {
    return null;
  }

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return { width: 16, height: 16, fontSize: 10 };
      case 'large':
        return { width: 28, height: 28, fontSize: 14 };
      default:
        return { width: 20, height: 20, fontSize: 12 };
    }
  };

  const badgeSize = getBadgeSize();

  return (
    <View style={[
      styles.badge,
      {
        width: badgeSize.width,
        height: badgeSize.height,
        borderRadius: badgeSize.width / 2,
      },
      style
    ]}>
      <Text style={[styles.badgeText, { fontSize: badgeSize.fontSize }]}>
        {totalItems > 99 ? '99+' : totalItems}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});