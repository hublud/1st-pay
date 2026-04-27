import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function BalanceCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isVisible, setIsVisible] = useState(true);

  return (
    <View style={[styles.card, { backgroundColor: theme.tint, shadowColor: theme.tint }]}>
      <View style={styles.header}>
        <Text style={styles.label}>Available Balance</Text>
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Ionicons name={isVisible ? "eye" : "eye-off"} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.balance}>
        {isVisible ? '₦ 1,450,000.50' : '****'}
      </Text>
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.accountLabel}>Account Number</Text>
          <Text style={styles.accountNumber}>1ST PAY - 8023456789</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn}>
          <Ionicons name="copy-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
  accountLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  accountNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  copyBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  }
});
