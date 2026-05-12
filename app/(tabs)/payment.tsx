import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Platform, Modal, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';

const recentTransfers = [
  { id: '1', name: 'Alice Smith', initials: 'AS' },
  { id: '2', name: 'Bob Johnson', initials: 'BJ' },
  { id: '3', name: 'Charlie', initials: 'CH' },
  { id: '4', name: 'David', initials: 'DA' },
];

export default function PaymentScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [payState, setPayState] = useState<'input' | 'pin' | 'scanning' | 'success'>('input');
  const [pin, setPin] = useState('');

  const openTransfer = (user: any) => {
    setSelectedUser(user);
    setAmount('');
    setPin('');
    setPayState('input');
  };

  useEffect(() => {
    if (payState === 'scanning') {
      const timer = setTimeout(() => {
        setPayState('success');
        setTimeout(() => setSelectedUser(null), 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [payState]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <Ionicons name="search" size={20} color={theme.icon} />
          <TextInput 
            placeholder="Search account, phone or name" 
            placeholderTextColor={theme.icon}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Beneficiaries</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
            {recentTransfers.map((user) => (
              <TouchableOpacity key={user.id} style={styles.recentItem} onPress={() => openTransfer(user)}>
                <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
                  <Text style={{ color: theme.text, fontWeight: 'bold' }}>{user.initials}</Text>
                </View>
                <Text style={[styles.recentName, { color: theme.text }]} numberOfLines={1}>
                  {user.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Actions list */}
        <View style={styles.actionsList}>
          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.surface }]}>
              <Ionicons name="people" size={24} color={theme.tint} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>Bulk Transfer</Text>
              <Text style={[styles.actionDesc, { color: theme.icon }]}>Send money to multiple people at once</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.surface, opacity: 0.5 }]} disabled>
            <View style={[styles.actionIcon, { backgroundColor: theme.surface }]}>
              <Ionicons name="globe" size={24} color={theme.icon} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>International Transfer</Text>
              <Text style={[styles.actionDesc, { color: theme.icon }]}>Coming Soon</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.surface }]}>
              <Ionicons name="calendar" size={24} color={theme.tint} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>Scheduled Transfers</Text>
              <Text style={[styles.actionDesc, { color: theme.icon }]}>Set up transfers for a future date</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.surface, borderBottomWidth: 0 }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.surface }]}>
              <Ionicons name="sync" size={24} color={theme.tint} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>Automatic Payments</Text>
              <Text style={[styles.actionDesc, { color: theme.icon }]}>Manage subscriptions, salaries and bills</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Transfer Modal */}
      <Modal animationType="slide" transparent={true} visible={!!selectedUser} onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderIndicator} />
              <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {payState === 'input' && (
                <View style={styles.centerContainer}>
                  <Text style={[styles.transferTitle, { color: theme.text }]}>Send to {selectedUser?.name}</Text>
                  
                  <View style={[styles.avatarLarge, { backgroundColor: theme.surface }]}>
                    <Text style={{ color: theme.text, fontSize: 32, fontWeight: 'bold' }}>{selectedUser?.initials}</Text>
                  </View>

                  <View style={styles.amountWrapper}>
                    <Text style={[styles.currencyLabel, { color: theme.text }]}>₦</Text>
                    <Text style={[styles.amountInput, { color: theme.text }]}>{amount || '0.00'}</Text>
                  </View>

                  <View style={styles.numPadGrid}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'Del'].map((item, idx) => (
                      <TouchableOpacity 
                        key={idx}
                        style={[styles.numPadBtn, { backgroundColor: theme.surface }]}
                        onPress={() => {
                          if (item === 'Del') setAmount(amount.slice(0, -1));
                          else if (item === '.' && amount.includes('.')) return;
                          else setAmount(amount + item);
                        }}
                      >
                        {item === 'Del' ? <Ionicons name="backspace" size={28} color={theme.text} /> :
                         <Text style={[styles.numPadText, { color: theme.text }]}>{item}</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.sendBtn, { backgroundColor: amount ? '#d2b661' : theme.surface }]}
                    disabled={!amount}
                    onPress={() => setPayState('pin')}
                  >
                    <Text style={[styles.sendBtnText, { color: amount ? '#000' : theme.icon }]}>Continue</Text>
                  </TouchableOpacity>
                </View>
              )}

              {payState === 'pin' && (
                <View style={styles.centerContainer}>
                  <View style={styles.lockIconContainer}>
                    <Ionicons name="lock-closed" size={32} color="#d2b661" />
                  </View>
                  <Text style={[styles.verifyTitle, { color: theme.text }]}>Verify Transfer</Text>
                  <Text style={[styles.verifySubtitle, { color: theme.icon }]}>Enter PIN or use Biometrics to confirm</Text>
                  
                  <View style={styles.pinIndicatorRow}>
                    {[1, 2, 3, 4].map(i => (
                      <View key={i} style={[styles.pinDot, { backgroundColor: pin.length >= i ? '#d2b661' : theme.surface }]} />
                    ))}
                  </View>
                  
                  <View style={styles.numPadGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'FaceID', 0, 'Del'].map((item, idx) => (
                      <TouchableOpacity 
                        key={idx}
                        style={[styles.numPadBtn, { backgroundColor: theme.surface }]}
                        onPress={() => {
                          if (item === 'FaceID') setPayState('scanning');
                          else if (item === 'Del') setPin(pin.slice(0, -1));
                          else {
                            const newPin = pin + item;
                            setPin(newPin);
                            if (newPin.length === 4) {
                              setTimeout(() => setPayState('scanning'), 300);
                            }
                          }
                        }}
                      >
                        {item === 'FaceID' ? <Ionicons name="scan" size={28} color={theme.text} /> :
                         item === 'Del' ? <Ionicons name="backspace" size={28} color={theme.text} /> :
                         <Text style={[styles.numPadText, { color: theme.text }]}>{item}</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {payState === 'scanning' && (
                <View style={styles.centerContainer}>
                  <Text style={[styles.scanningAmount, { color: theme.text }]}>₦{amount}</Text>
                  <View style={styles.scanningVisual}>
                    <ActivityIndicator size="large" color="#d2b661" />
                  </View>
                  <Text style={[styles.scanningText, { color: theme.text }]}>Processing payment...</Text>
                </View>
              )}

              {payState === 'success' && (
                <View style={styles.centerContainer}>
                  <View style={styles.successLottie}>
                    <Ionicons name="checkmark-circle" size={100} color="#22c55e" />
                  </View>
                  <Text style={[styles.successTitle, { color: theme.text }]}>Transfer Successful!</Text>
                  <Text style={[styles.successSubtitle, { color: theme.icon }]}>Sent ₦{amount} to {selectedUser?.name}</Text>
                  
                  <TouchableOpacity 
                    style={[styles.doneBtn, { backgroundColor: '#d2b661' }]}
                    onPress={() => setSelectedUser(null)}
                  >
                    <Text style={styles.doneBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  content: { paddingBottom: 40 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16 },
  section: { marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 16 },
  recentScroll: { paddingHorizontal: 20 },
  recentItem: { alignItems: 'center', marginRight: 20, width: 64 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  recentName: { fontSize: 12 },
  actionsList: { marginTop: 32, paddingHorizontal: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actionTextContainer: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  actionDesc: { fontSize: 13 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: '80%', maxHeight: '90%' },
  modalHeader: { alignItems: 'center', marginBottom: 10 },
  modalHeaderIndicator: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 10 },
  modalCloseBtn: { position: 'absolute', right: 0, top: 0, padding: 4 },
  centerContainer: { alignItems: 'center', flex: 1, paddingTop: 20 },
  transferTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  avatarLarge: { width: 84, height: 84, borderRadius: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  amountWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 10,
    width: '80%',
  },
  currencyLabel: { fontSize: 24, fontWeight: '600', marginRight: 10 },
  amountInput: { fontSize: 56, fontWeight: 'bold', minWidth: 100, textAlign: 'center' },
  numPadSpacer: { height: 100 },
  sendBtn: { width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 40 },
  sendBtnText: { fontSize: 18, fontWeight: 'bold' },
  // PIN Styles
  lockIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(210, 182, 97, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  verifyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  verifySubtitle: { fontSize: 14, marginBottom: 30 },
  pinIndicatorRow: { flexDirection: 'row', gap: 15, marginBottom: 40 },
  pinDot: { width: 14, height: 14, borderRadius: 7 },
  numPadGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', gap: 15 },
  numPadBtn: { width: 75, height: 75, justifyContent: 'center', alignItems: 'center', borderRadius: 40 },
  numPadText: { fontSize: 26, fontWeight: '600' },
  // Scanning/Success
  scanningAmount: { fontSize: 36, fontWeight: 'bold', marginBottom: 40 },
  scanningVisual: { marginVertical: 40 },
  scanningText: { fontSize: 16, fontWeight: '500' },
  successLottie: { marginBottom: 30 },
  successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  successSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40 },
  doneBtn: { width: '100%', padding: 18, borderRadius: 16, alignItems: 'center' },
  doneBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
