import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const spentData = [
  { day: 'Mon', amount: 30 },
  { day: 'Tue', amount: 80 },
  { day: 'Wed', amount: 45 },
  { day: 'Thu', amount: 100 },
  { day: 'Fri', amount: 60 },
  { day: 'Sat', amount: 90 },
  { day: 'Sun', amount: 20 },
];

const receivedData = [
  { day: 'Mon', amount: 60 },
  { day: 'Tue', amount: 40 },
  { day: 'Wed', amount: 90 },
  { day: 'Thu', amount: 20 },
  { day: 'Fri', amount: 80 },
  { day: 'Sat', amount: 40 },
  { day: 'Sun', amount: 70 },
];

const sentData = [
  { day: 'Mon', amount: 20 },
  { day: 'Tue', amount: 30 },
  { day: 'Wed', amount: 60 },
  { day: 'Thu', amount: 10 },
  { day: 'Fri', amount: 40 },
  { day: 'Sat', amount: 80 },
  { day: 'Sun', amount: 50 },
];

const transactions = [
  { id: '1', type: 'sent', name: 'Alice Smith', date: '26 Apr, 10:30 AM', amount: '12,500' },
  { id: '2', type: 'received', name: 'Salary', date: '25 Apr, 08:00 AM', amount: '450,000' },
  { id: '3', type: 'spent', name: 'Shoprite', date: '24 Apr, 06:15 PM', amount: '35,200' },
  { id: '4', type: 'received', name: 'Charlie', date: '23 Apr, 02:45 PM', amount: '5,000' },
  { id: '5', type: 'spent', name: 'Netflix', date: '21 Apr, 12:00 AM', amount: '4,500' },
  { id: '6', type: 'spent', name: 'Uber', date: '20 Apr, 04:30 PM', amount: '3,800' },
  { id: '7', type: 'sent', name: 'David Jones', date: '19 Apr, 02:15 PM', amount: '2,000' },
];

export default function SpendingScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [chartType, setChartType] = useState<'spent' | 'received' | 'sent'>('spent');
  const currentData = chartType === 'spent' ? spentData : chartType === 'received' ? receivedData : sentData;
  const filteredTransactions = transactions.filter(tx => tx.type === chartType);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Spending Analytics</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.summaryLabel, { color: theme.icon }]}>
            {chartType === 'spent' ? 'Total Spent This Month' : chartType === 'received' ? 'Total Received This Month' : 'Total Sent This Month'}
          </Text>
          <Text style={[styles.summaryAmount, { color: theme.text }]}>
            {chartType === 'spent' ? '₦ 145,800.00' : chartType === 'received' ? '₦ 520,400.00' : '₦ 65,200.00'}
          </Text>
          <View style={[styles.badge, { backgroundColor: chartType === 'received' ? 'rgba(46, 204, 113, 0.1)' : chartType === 'sent' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(212, 175, 55, 0.1)' }]}>
            <Ionicons name={chartType === 'received' ? "trending-up" : "trending-down"} size={16} color={chartType === 'received' ? '#2ecc71' : chartType === 'sent' ? '#e74c3c' : theme.tint} />
            <Text style={[styles.badgeText, { color: chartType === 'received' ? '#2ecc71' : chartType === 'sent' ? '#e74c3c' : theme.tint }]}>
              {chartType === 'received' ? '8% more than last month' : chartType === 'sent' ? '4% less than last month' : '12% less than last month'}
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Overview</Text>
            <View style={[styles.toggleContainer, { backgroundColor: theme.surface }]}>
              <TouchableOpacity 
                style={[styles.toggleBtn, chartType === 'spent' && { backgroundColor: theme.tint }]}
                onPress={() => setChartType('spent')}
              >
                <Text style={[styles.toggleText, { color: chartType === 'spent' ? '#FFF' : theme.icon }]}>Spent</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, chartType === 'received' && { backgroundColor: '#2ecc71' }]}
                onPress={() => setChartType('received')}
              >
                <Text style={[styles.toggleText, { color: chartType === 'received' ? '#FFF' : theme.icon }]}>Received</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, chartType === 'sent' && { backgroundColor: '#e74c3c' }]}
                onPress={() => setChartType('sent')}
              >
                <Text style={[styles.toggleText, { color: chartType === 'sent' ? '#FFF' : theme.icon }]}>Sent</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.chartContainer, { backgroundColor: theme.surface }]}>
            <View style={styles.barsContainer}>
              {currentData.map((data, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={[styles.barBackground, { backgroundColor: theme.background }]}>
                    <View style={[
                      styles.barFill, 
                      { 
                        height: `${data.amount}%`, 
                        backgroundColor: chartType === 'spent' ? theme.tint : chartType === 'received' ? '#2ecc71' : '#e74c3c' 
                      }
                    ]} />
                  </View>
                  <Text style={[styles.barLabel, { color: theme.icon }]}>{data.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 16 }]}>Transaction History</Text>
          
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
  summaryCard: { padding: 24, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  summaryLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  summaryAmount: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  section: { marginTop: 32 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  toggleContainer: { flexDirection: 'row', borderRadius: 20, padding: 4 },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  toggleText: { fontSize: 13, fontWeight: 'bold' },
  chartContainer: { padding: 20, borderRadius: 20, height: 220 },
  barsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20 },
  barColumn: { alignItems: 'center', width: 30 },
  barBackground: { width: 12, height: 120, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { marginTop: 12, fontSize: 12, fontWeight: '500' },
  transactionsList: { gap: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  txIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  txDetails: { flex: 1 },
  txName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  txDate: { fontSize: 13 },
  txAmountContainer: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
});
