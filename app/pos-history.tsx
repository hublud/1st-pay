import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const posTransactions = [
  { id: '1', type: 'received', name: 'Card Payment - *4242', date: 'Today, 12:45 PM', amount: '25,000' },
  { id: '2', type: 'received', name: 'Transfer - Bob J.', date: 'Today, 11:30 AM', amount: '120,000' },
  { id: '3', type: 'sent', name: 'Settlement to Main Wallet', date: 'Yesterday, 06:15 PM', amount: '150,200' },
  { id: '4', type: 'received', name: 'QR Payment - Alice S.', date: 'Yesterday, 02:45 PM', amount: '5,000' },
  { id: '5', type: 'received', name: 'Card Payment - *9012', date: '27 Apr, 04:30 PM', amount: '8,800' },
  { id: '6', type: 'sent', name: 'Payout to Bank', date: '26 Apr, 02:15 PM', amount: '45,000' },
];

export default function POSHistoryScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');
  
  const filteredTransactions = posTransactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Terminal History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Summary Mini-Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.icon }]}>Total Received</Text>
            <Text style={[styles.summaryAmount, { color: '#2ecc71' }]}>₦ 158,800.00</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.background }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.icon }]}>Total Sent</Text>
            <Text style={[styles.summaryAmount, { color: '#e74c3c' }]}>₦ 195,200.00</Text>
          </View>
        </View>

        {/* Filter Toggles */}
        <View style={[styles.toggleContainer, { backgroundColor: theme.surface }]}>
          {(['all', 'received', 'sent'] as const).map((t) => (
            <TouchableOpacity 
              key={t}
              style={[styles.toggleBtn, filter === t && { backgroundColor: t === 'received' ? '#2ecc71' : t === 'sent' ? '#e74c3c' : theme.tint }]}
              onPress={() => setFilter(t)}
            >
              <Text style={[styles.toggleText, { color: filter === t ? '#FFF' : theme.icon }]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {filteredTransactions.map((tx) => (
            <View key={tx.id} style={[styles.txRow, { borderBottomColor: theme.surface }]}>
              <View style={[styles.txIconContainer, { backgroundColor: tx.type === 'received' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)' }]}>
                <Ionicons 
                  name={tx.type === 'received' ? 'arrow-down' : 'arrow-up'} 
                  size={20} 
                  color={tx.type === 'received' ? '#2ecc71' : '#e74c3c'} 
                />
              </View>
              
              <View style={styles.txDetails}>
                <Text style={[styles.txName, { color: theme.text }]}>{tx.name}</Text>
                <Text style={[styles.txDate, { color: theme.icon }]}>{tx.date}</Text>
              </View>
              
              <View style={styles.txAmountContainer}>
                <Text style={[
                  styles.txAmount, 
                  { color: tx.type === 'received' ? '#2ecc71' : theme.text }
                ]}>
                  {tx.type === 'received' ? '+' : '-'}₦ {tx.amount}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { padding: 8, marginLeft: -8 },
  title: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 40 },
  content: { paddingBottom: 40, paddingHorizontal: 20 },
  summaryCard: { 
    padding: 20, 
    borderRadius: 24, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  summaryAmount: { fontSize: 18, fontWeight: 'bold' },
  divider: { width: 1, height: 40, marginHorizontal: 10 },
  toggleContainer: { 
    flexDirection: 'row', 
    borderRadius: 16, 
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  toggleText: { fontSize: 12, fontWeight: 'bold' },
  transactionsList: { gap: 4 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  txIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  txDetails: { flex: 1 },
  txName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  txDate: { fontSize: 12, opacity: 0.6 },
  txAmountContainer: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: 'bold' },
});
