import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function MakePaymentButton() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/supermarket-payment')}
      >
        <Ionicons name="scan-outline" size={24} color="#FFF" style={styles.icon} />
        <Text style={styles.text}>Make Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
