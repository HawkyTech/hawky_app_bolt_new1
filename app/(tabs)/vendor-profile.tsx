import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function VendorProfileRedirect() {
  const { id } = useLocalSearchParams();
  
  React.useEffect(() => {
    if (id) {
      router.replace(`/(tabs)/vendor-profile/${id}`);
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});