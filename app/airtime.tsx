import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, Platform, TouchableOpacity, Modal } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const topUpOptions = [
  { amount: '50', cashback: '0.5' },
  { amount: '100', cashback: '1' },
  { amount: '200', cashback: '2' },
  { amount: '500', cashback: '5' },
  { amount: '1000', cashback: '10', display: '1,000' },
  { amount: '2000', cashback: '20', display: '2,000' },
];

export default function AirtimeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('airtel'); 
  const [payState, setPayState] = useState<'input' | 'pin' | 'success'>('input');
  const [pin, setPin] = useState('');
  
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#262626' : '#FFFFFF';
  const innerBg = isDark ? '#1C1C1E' : '#F5F5F5';
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F2F2F7' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Airtime</Text>
        <TouchableOpacity>
          <Text style={{ color: theme.tint, fontWeight: '600', fontSize: 16 }}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Promo Banner */}
        <View style={[styles.promoBanner, { backgroundColor: isDark ? theme.tint + '15' : theme.tint + '10' }]}>
          <View style={styles.promoContent}>
            <Text style={[styles.promoTitle, { color: theme.text }]}>Claim 15 Discounts with</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[styles.promoPrice, { color: theme.tint }]}>₦99 </Text>
              <Text style={[styles.promoSub, { color: theme.text }]}>on any Bill</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.claimBtn, { backgroundColor: theme.tint }]}>
            <Text style={styles.claimBtnText}>Claim</Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={[styles.inputSection, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.networkSelector}>
            <View style={[styles.networkIcon, { backgroundColor: '#FF0000' }]}>
              <Text style={styles.networkText}>airtel</Text>
            </View>
            <Ionicons name="caret-down" size={12} color={theme.icon} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
          
          <TextInput
            style={[styles.phoneInput, { color: theme.text }]}
            placeholder="090 2571 3908"
            placeholderTextColor={theme.icon}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          
          <TouchableOpacity style={[styles.contactBtn, { backgroundColor: theme.tint }]}>
            <Ionicons name="person" size={16} color={isDark ? '#000' : '#FFF'} />
          </TouchableOpacity>
        </View>

        {/* Top Up Section */}
        <View style={[styles.topUpSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Top up</Text>
          
          <View style={styles.grid}>
            {topUpOptions.map((opt, idx) => {
              const isSelected = amount === opt.amount;
              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[
                    styles.gridItem, 
                    { backgroundColor: innerBg },
                    isSelected && { borderColor: theme.tint, borderWidth: 1.5, backgroundColor: isDark ? theme.tint + '15' : theme.tint + '10' }
                  ]}
                  onPress={() => setAmount(opt.amount)}
                >
                  <Text style={[styles.cashbackText, { color: theme.tint }]}>₦{opt.cashback} Cashback</Text>
                  <Text style={[styles.amountGridText, { color: theme.text }]}>
                    ₦{opt.display || opt.amount}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Amount */}
          <View style={[styles.customAmountRow, { borderBottomColor: isDark ? '#333' : '#E5E5E5' }]}>
            <Text style={[styles.currencySymbol, { color: theme.text }]}>₦</Text>
            <TextInput
              style={[styles.customAmountInput, { color: theme.text }]}
              placeholder="0 - 5,000,000"
              placeholderTextColor={theme.icon}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity 
              style={[styles.payBtn, { backgroundColor: theme.tint, opacity: amount ? 1 : 0.7 }]}
              disabled={!amount}
              onPress={() => setPayState('pin')}
            >
              <Text style={[styles.payBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                Pay ₦{amount ? Number(amount).toLocaleString() : '0'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Protection Footer */}
        <View style={styles.protectionFooter}>
          <View style={styles.ndicContainer}>
            <Text style={[styles.ndicLogo, { color: theme.text }]}>|NDIC</Text>
            <Text style={styles.ndicSub}>Nigeria Deposit Insurance Corporation</Text>
            <Text style={styles.ndicSubSmall}>Protecting your bank deposits</Text>
          </View>
          <Text style={styles.protectedText}>Protected</Text>
          
          <View style={styles.protectionTitleRow}>
            <Ionicons name="shield-checkmark" size={16} color={theme.text} />
            <Text style={[styles.protectionTitle, { color: theme.text }]}>Deposit protection</Text>
          </View>
          
          <Text style={styles.protectionDesc}>
            Eligible deposits in 1ST PAY are protected by Nigeria Deposit Insurance Scheme
          </Text>
        </View>

      </ScrollView>

      {/* Payment Modal */}
      <Modal animationType="slide" transparent={true} visible={payState !== 'input'} onRequestClose={() => setPayState('input')}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {payState === 'pin' && 'Verify Top-up'}
                {payState === 'success' && 'Done'}
              </Text>
              <TouchableOpacity onPress={() => { setPayState('input'); setPin(''); }}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {payState === 'pin' && (
              <View style={styles.centerContainer}>
                <Ionicons name="lock-closed" size={48} color={theme.tint} style={{ marginBottom: 20 }} />
                <Text style={{ color: theme.text, fontSize: 18, marginBottom: 20 }}>Enter PIN or use Biometrics</Text>
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 40 }}>
                  {[1, 2, 3, 4].map(i => (
                    <View key={i} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: pin.length >= i ? theme.tint : theme.surface }} />
                  ))}
                </View>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 280, gap: 10 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'FaceID', 0, 'Del'].map((item, idx) => (
                    <TouchableOpacity 
                      key={idx}
                      style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 40, backgroundColor: theme.surface }}
                      onPress={() => {
                        if (item === 'FaceID') setPayState('success');
                        else if (item === 'Del') setPin(pin.slice(0, -1));
                        else {
                          const newPin = pin + item;
                          setPin(newPin);
                          if (newPin.length === 4) {
                            setTimeout(() => setPayState('success'), 300);
                          }
                        }
                      }}
                    >
                      {item === 'FaceID' ? <Ionicons name="scan" size={32} color={theme.text} /> :
                       item === 'Del' ? <Ionicons name="backspace" size={32} color={theme.text} /> :
                       <Text style={{ fontSize: 28, color: theme.text }}>{item}</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {payState === 'success' && (
              <View style={styles.centerContainer}>
                <View style={[styles.successCircle, { backgroundColor: theme.tint }]}>
                  <Ionicons name="checkmark" size={60} color="#FFFFFF" />
                </View>
                <Text style={[styles.amountText, { color: theme.text, marginTop: 20 }]}>Top-up Successful!</Text>
                <Text style={[styles.merchantText, { color: theme.icon, marginTop: 10 }]}>Recharged {phoneNumber || 'your number'} with ₦{amount}</Text>
              </View>
            )}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4, marginLeft: -4 },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  
  promoBanner: { 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
    marginBottom: 20
  },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  promoPrice: { fontSize: 24, fontWeight: '900' },
  promoSub: { fontSize: 14, fontWeight: '600' },
  claimBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  claimBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  networkSelector: { flexDirection: 'row', alignItems: 'center' },
  networkIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  networkText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  divider: { width: 1, height: 30, marginHorizontal: 12 },
  phoneInput: { flex: 1, fontSize: 18, fontWeight: '600', height: 40 },
  contactBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  topUpSection: {
    borderRadius: 24,
    padding: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: {
    width: '31%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  cashbackText: { fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
  amountGridText: { fontSize: 18, fontWeight: 'bold' },

  customAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  currencySymbol: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  customAmountInput: { flex: 1, fontSize: 18, height: 40 },
  payBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  payBtnText: { fontWeight: 'bold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  centerContainer: { alignItems: 'center', paddingVertical: 20 },
  successCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  amountText: { fontSize: 24, fontWeight: 'bold' },
  merchantText: { fontSize: 16 },

  protectionFooter: { alignItems: 'center', marginTop: 30, paddingHorizontal: 20 },
  ndicContainer: { alignItems: 'center', marginBottom: 8 },
  ndicLogo: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  ndicSub: { fontSize: 8, color: '#888', marginTop: -6 },
  ndicSubSmall: { fontSize: 6, color: '#AAA', marginTop: 2 },
  protectedText: { fontSize: 12, color: '#666', fontWeight: 'bold', marginBottom: 24 },
  protectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  protectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 6 },
  protectionDesc: { fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 18 },
});
