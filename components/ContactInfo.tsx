import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react-native';

interface ContactInfoProps {
  showTitle?: boolean;
  compact?: boolean;
}

export default function ContactInfo({ showTitle = true, compact = false }: ContactInfoProps) {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@hawky.in').catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+918722043143').catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleAddressPress = () => {
    const address = 'BHIVE Premium Church Street, 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001';
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {showTitle && (
        <Text style={styles.title}>Contact Information</Text>
      )}
      
      <View style={styles.companyInfo}>
        <View style={styles.infoRow}>
          <Building2 size={16} color="#4CAF50" />
          <Text style={styles.companyName}>HAWKERKART ONLINE PRIVATE LIMITED</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
        <View style={styles.iconContainer}>
          <Mail size={18} color="#4CAF50" />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>info@hawky.in</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
        <View style={styles.iconContainer}>
          <Phone size={18} color="#4CAF50" />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactLabel}>Customer Care</Text>
          <Text style={styles.contactValue}>+91 8722043143</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem} onPress={handleAddressPress}>
        <View style={styles.iconContainer}>
          <MapPin size={18} color="#4CAF50" />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactLabel}>Office Address</Text>
          <Text style={styles.addressValue}>
            BHIVE Premium Church Street, 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactContainer: {
    margin: 0,
    padding: 16,
    shadowOpacity: 0,
    elevation: 0,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  companyInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  contactValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  addressValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
});