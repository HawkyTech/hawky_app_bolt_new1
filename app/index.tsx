import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, Search, Heart, Star, Truck, ShoppingBag, Users, TrendingUp, ArrowRight, Play, CircleCheck as CheckCircle, Smartphone, Globe, Shield } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const consumerFeatures: FeatureCard[] = [
  {
    id: '1',
    title: 'Discover Local Vendors',
    description: 'Find authentic street food and local businesses near you',
    icon: Search,
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Real-time Tracking',
    description: 'Track vendor locations and availability in real-time',
    icon: MapPin,
    color: '#66BB6A',
  },
  {
    id: '3',
    title: 'Save Favorites',
    description: 'Bookmark your favorite vendors and never lose them',
    icon: Heart,
    color: '#81C784',
  },
  {
    id: '4',
    title: 'Reviews & Ratings',
    description: 'Read reviews and rate your experiences',
    icon: Star,
    color: '#A5D6A7',
  },
];

const vendorFeatures: FeatureCard[] = [
  {
    id: '1',
    title: 'Digital Presence',
    description: 'Create your online storefront and reach more customers',
    icon: Smartphone,
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Location Management',
    description: 'Update your location and let customers find you easily',
    icon: MapPin,
    color: '#66BB6A',
  },
  {
    id: '3',
    title: 'Customer Insights',
    description: 'Understand your customers and grow your business',
    icon: TrendingUp,
    color: '#81C784',
  },
  {
    id: '4',
    title: 'Secure Payments',
    description: 'Accept digital payments safely and securely',
    icon: Shield,
    color: '#A5D6A7',
  },
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Food Enthusiast',
    content: 'HAWKY helped me discover amazing street food vendors I never knew existed in my area!',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Street Vendor',
    content: 'Since joining HAWKY, my customer base has grown by 300%. It\'s been life-changing!',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  },
  {
    id: '3',
    name: 'Anita Patel',
    role: 'Local Shopper',
    content: 'The app makes it so easy to find fresh vegetables and fruits from local vendors.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  },
];

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState<'consumer' | 'vendor'>('consumer');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user } = useAuth();
  
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      if (user.role === 'vendor') {
        router.replace('/(vendor)');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    // Initial animations
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withTiming(0, { duration: 800 });
    
    // Pulse animation for CTA button
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  const handleGetStarted = () => {
    router.push('/(auth)/signin');
  };

  const handleRoleSwitch = (role: 'consumer' | 'vendor') => {
    setActiveRole(role);
  };

  const renderFeatureCard = (feature: FeatureCard, index: number) => {
    const IconComponent = feature.icon;
    return (
      <View key={feature.id} style={styles.featureCard}>
        <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
          <IconComponent size={24} color={feature.color} />
        </View>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    );
  };

  const renderTestimonial = (testimonial: Testimonial, index: number) => {
    const isActive = index === currentTestimonial;
    return (
      <View key={testimonial.id} style={[styles.testimonialCard, !isActive && styles.testimonialCardHidden]}>
        <View style={styles.testimonialHeader}>
          <Image source={{ uri: testimonial.avatar }} style={styles.testimonialAvatar} />
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>{testimonial.name}</Text>
            <Text style={styles.testimonialRole}>{testimonial.role}</Text>
            <View style={styles.testimonialRating}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={12} color="#FFD700" fill="#FFD700" />
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.testimonialContent}>"{testimonial.content}"</Text>
      </View>
    );
  };

  // Don't render anything if user is logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Animated.View style={[styles.heroContent, animatedHeaderStyle]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>H</Text>
            </View>
            <Text style={styles.brandName}>HAWKY</Text>
          </View>
          
          {/* Tagline */}
          <Text style={styles.heroTagline}>From Street Carts to Your Cart</Text>
          <Text style={styles.heroSubtitle}>
            Empowering India's Street Vendor Economy
          </Text>
          
          {/* Hero Description */}
          <Text style={styles.heroDescription}>
            Connect with local street vendors and small businesses in your area. 
            Discover authentic products, support local entrepreneurs, and experience 
            the convenience of modern technology.
          </Text>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <Animated.View style={animatedPulseStyle}>
              <TouchableOpacity style={styles.primaryCTA} onPress={handleGetStarted}>
                <Text style={styles.primaryCTAText}>Get Started</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity style={styles.secondaryCTA}>
              <Play size={16} color="#4CAF50" />
              <Text style={styles.secondaryCTAText}>Watch Demo</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
            style={styles.heroImage}
          />
          <View style={styles.heroImageOverlay}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Vendors</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>25+</Text>
                <Text style={styles.statLabel}>Cities</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Role Selection */}
      <View style={styles.roleSection}>
        <Text style={styles.sectionTitle}>Choose Your Journey</Text>
        <Text style={styles.sectionSubtitle}>
          Whether you're looking to discover or sell, HAWKY has you covered
        </Text>
        
        <View style={styles.roleToggle}>
          <TouchableOpacity
            style={[styles.roleButton, activeRole === 'consumer' && styles.activeRoleButton]}
            onPress={() => handleRoleSwitch('consumer')}
          >
            <Users size={20} color={activeRole === 'consumer' ? '#FFFFFF' : '#4CAF50'} />
            <Text style={[styles.roleButtonText, activeRole === 'consumer' && styles.activeRoleButtonText]}>
              I'm a Consumer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleButton, activeRole === 'vendor' && styles.activeRoleButton]}
            onPress={() => handleRoleSwitch('vendor')}
          >
            <Truck size={20} color={activeRole === 'vendor' ? '#FFFFFF' : '#4CAF50'} />
            <Text style={[styles.roleButtonText, activeRole === 'vendor' && styles.activeRoleButtonText]}>
              I'm a Vendor
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>
          {activeRole === 'consumer' ? 'Discover & Explore' : 'Grow Your Business'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {activeRole === 'consumer' 
            ? 'Find amazing local vendors and authentic products near you'
            : 'Reach more customers and grow your street business digitally'
          }
        </Text>
        
        <View style={styles.featuresGrid}>
          {(activeRole === 'consumer' ? consumerFeatures : vendorFeatures).map(renderFeatureCard)}
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>How HAWKY Works</Text>
        <Text style={styles.sectionSubtitle}>
          Simple steps to get started on your journey
        </Text>
        
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Sign Up</Text>
            <Text style={styles.stepDescription}>
              Create your account and choose your role
            </Text>
          </View>
          
          <View style={styles.stepConnector} />
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>
              {activeRole === 'consumer' ? 'Discover' : 'Set Up Shop'}
            </Text>
            <Text style={styles.stepDescription}>
              {activeRole === 'consumer' 
                ? 'Find vendors and products near you'
                : 'Create your digital storefront'
              }
            </Text>
          </View>
          
          <View style={styles.stepConnector} />
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>
              {activeRole === 'consumer' ? 'Connect' : 'Grow'}
            </Text>
            <Text style={styles.stepDescription}>
              {activeRole === 'consumer' 
                ? 'Connect with vendors and make purchases'
                : 'Reach customers and grow your business'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>What People Say</Text>
        <Text style={styles.sectionSubtitle}>
          Real stories from our community
        </Text>
        
        <View style={styles.testimonialsContainer}>
          {testimonials.map(renderTestimonial)}
        </View>
        
        <View style={styles.testimonialDots}>
          {testimonials.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dot, index === currentTestimonial && styles.activeDot]}
              onPress={() => setCurrentTestimonial(index)}
            />
          ))}
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Why Choose HAWKY?</Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>100% Free to join and use</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Secure and trusted platform</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>24/7 customer support</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Growing community of 50K+ users</Text>
          </View>
        </View>
      </View>

      {/* Final CTA */}
      <View style={styles.finalCTASection}>
        <Text style={styles.finalCTATitle}>Ready to Get Started?</Text>
        <Text style={styles.finalCTASubtitle}>
          Join thousands of users who are already part of the HAWKY community
        </Text>
        
        <TouchableOpacity style={styles.finalCTAButton} onPress={handleGetStarted}>
          <Text style={styles.finalCTAButtonText}>Join HAWKY Today</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.finalCTANote}>
          No credit card required • Free forever
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLogo}>
            <View style={styles.footerLogoCircle}>
              <Text style={styles.footerLogoText}>H</Text>
            </View>
            <Text style={styles.footerBrandName}>HAWKY</Text>
          </View>
          
          <Text style={styles.footerTagline}>
            Empowering India's Street Vendor Economy
          </Text>
          
          <Text style={styles.footerCopyright}>
            © 2024 HAWKERKART ONLINE PRIVATE LIMITED. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  brandName: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1C1C1E',
    letterSpacing: 2,
  },
  heroTagline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaContainer: {
    alignItems: 'center',
    gap: 16,
  },
  primaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  primaryCTAText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
  },
  secondaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  secondaryCTAText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
  },
  
  // Hero Image
  heroImageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  heroImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  heroImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  
  // Role Section
  roleSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  activeRoleButton: {
    backgroundColor: '#4CAF50',
  },
  roleButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
  },
  activeRoleButtonText: {
    color: '#FFFFFF',
  },
  
  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // How It Works
  howItWorksSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
  },
  stepsContainer: {
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    maxWidth: 200,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  stepConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginVertical: 20,
  },
  
  // Testimonials
  testimonialsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  testimonialsContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 24,
  },
  testimonialCard: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testimonialCardHidden: {
    opacity: 0,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  testimonialRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  testimonialRating: {
    flexDirection: 'row',
  },
  testimonialContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  testimonialDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  
  // Benefits
  benefitsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  
  // Final CTA
  finalCTASection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  finalCTATitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  finalCTASubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 32,
  },
  finalCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  finalCTAButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#4CAF50',
    marginRight: 8,
  },
  finalCTANote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  
  // Footer
  footer: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 40,
  },
  footerContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  footerLogoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  footerBrandName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  footerTagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  footerCopyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});