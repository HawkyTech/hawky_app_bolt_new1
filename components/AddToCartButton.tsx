import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ShoppingCart, Plus, Minus } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { VendorProduct } from '@/types/vendor';

interface AddToCartButtonProps {
  product: VendorProduct;
  vendorId: string;
  vendorName: string;
  style?: any;
  size?: 'small' | 'medium' | 'large';
  showQuantity?: boolean;
}

export default function AddToCartButton({
  product,
  vendorId,
  vendorName,
  style,
  size = 'medium',
  showQuantity = true,
}: AddToCartButtonProps) {
  const { addToCart, getItemQuantity, updateQuantity, items } = useCart();
  const [animatedValue] = useState(new Animated.Value(1));
  
  const currentQuantity = getItemQuantity(product.id);
  const cartItem = items.find(item => item.product.id === product.id);

  const handleAddToCart = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    addToCart(product, vendorId, vendorName);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (cartItem) {
      updateQuantity(cartItem.id, newQuantity);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { height: 32, paddingHorizontal: 12, fontSize: 12, iconSize: 14 };
      case 'large':
        return { height: 48, paddingHorizontal: 20, fontSize: 16, iconSize: 20 };
      default:
        return { height: 40, paddingHorizontal: 16, fontSize: 14, iconSize: 16 };
    }
  };

  const buttonSize = getButtonSize();

  if (!product.isAvailable) {
    return (
      <View style={[
        styles.button,
        styles.disabledButton,
        { height: buttonSize.height, paddingHorizontal: buttonSize.paddingHorizontal },
        style
      ]}>
        <Text style={[styles.disabledText, { fontSize: buttonSize.fontSize }]}>
          Unavailable
        </Text>
      </View>
    );
  }

  if (currentQuantity > 0 && showQuantity) {
    return (
      <View style={[styles.quantityContainer, style]}>
        <TouchableOpacity
          style={[styles.quantityButton, styles.decreaseButton]}
          onPress={() => handleUpdateQuantity(currentQuantity - 1)}
        >
          <Minus size={buttonSize.iconSize} color="#4CAF50" />
        </TouchableOpacity>
        
        <View style={styles.quantityDisplay}>
          <Text style={[styles.quantityText, { fontSize: buttonSize.fontSize }]}>
            {currentQuantity}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.quantityButton, styles.increaseButton]}
          onPress={() => handleUpdateQuantity(currentQuantity + 1)}
        >
          <Plus size={buttonSize.iconSize} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.addButton,
          { height: buttonSize.height, paddingHorizontal: buttonSize.paddingHorizontal },
          style
        ]}
        onPress={handleAddToCart}
        activeOpacity={0.8}
      >
        <ShoppingCart size={buttonSize.iconSize} color="#FFFFFF" />
        <Text style={[styles.addText, { fontSize: buttonSize.fontSize }]}>
          Add
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
  },
  addText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  disabledText: {
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseButton: {
    backgroundColor: '#F8F9FA',
  },
  increaseButton: {
    backgroundColor: '#4CAF50',
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
});