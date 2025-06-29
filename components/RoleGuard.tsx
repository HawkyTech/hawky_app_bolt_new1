import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { ShieldAlert, ArrowLeft } from 'lucide-react-native';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('consumer' | 'vendor')[];
  fallbackMessage?: string;
  showFallback?: boolean;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackMessage,
  showFallback = true 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    router.replace('/(auth)/signin');
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    if (!showFallback) {
      router.back();
      return null;
    }

    return (
      <View style={styles.accessDeniedContainer}>
        <View style={styles.accessDeniedContent}>
          <View style={styles.iconContainer}>
            <ShieldAlert size={64} color="#FF3B30" />
          </View>
          
          <Text style={styles.accessDeniedTitle}>Access Restricted</Text>
          
          <Text style={styles.accessDeniedMessage}>
            {fallbackMessage || 
              `This feature is only available for ${allowedRoles.join(' and ')} accounts.`
            }
          </Text>
          
          <Text style={styles.currentRoleText}>
            You are currently signed in as a {user.role}.
          </Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#4CAF50" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  accessDeniedContent: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  accessDeniedTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center',
  },
  accessDeniedMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  currentRoleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
  },
});