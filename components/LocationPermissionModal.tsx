import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { MapPin, Navigation, Shield, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface LocationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export default function LocationPermissionModal({
  visible,
  onAllow,
  onDeny,
  onClose,
}: LocationPermissionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#8E8E93" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <MapPin size={48} color="#4CAF50" />
          </View>

          <Text style={styles.title}>Enable Location Services</Text>
          <Text style={styles.description}>
            HAWKY needs access to your location to help you discover nearby vendors and provide accurate distance information.
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Navigation size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Find vendors near you</Text>
            </View>
            <View style={styles.benefitItem}>
              <MapPin size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Get accurate distances</Text>
            </View>
            <View style={styles.benefitItem}>
              <Shield size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Your privacy is protected</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.allowButton} onPress={onAllow}>
              <Text style={styles.allowButtonText}>Allow Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.denyButton} onPress={onDeny}>
              <Text style={styles.denyButtonText}>Not Now</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.privacyNote}>
            Your location data is only used to enhance your experience and is never shared with third parties.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: Math.min(width - 40, 400),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  allowButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  allowButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  denyButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  denyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8E8E93',
  },
  privacyNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#C7C7CC',
    textAlign: 'center',
    lineHeight: 16,
  },
});