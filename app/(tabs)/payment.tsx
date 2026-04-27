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
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {payState === 'input' && `Send to ${selectedUser?.name}`}
                {payState === 'pin' && 'Verify Transfer'}
                {payState === 'scanning' && 'NFC Transfer'}
                {payState === 'success' && 'Done'}
              </Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {payState === 'input' && (
              <View style={styles.centerContainer}>
                <View style={[styles.avatarLarge, { backgroundColor: theme.surface }]}>
                  <Text style={{ color: theme.text, fontSize: 32, fontWeight: 'bold' }}>{selectedUser?.initials}</Text>
                </View>
                <Text style={{ color: theme.text, fontSize: 24, marginTop: 10 }}>₦</Text>
                <TextInput
                  style={[styles.amountInput, { color: theme.text }]}
                  placeholder="0.00"
                  placeholderTextColor={theme.icon}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus
                />
                <TouchableOpacity 
                  style={[styles.sendBtn, { backgroundColor: amount ? theme.tint : theme.surface }]}
                  disabled={!amount}
                  onPress={() => setPayState('pin')}
                >
                  <Text style={[styles.sendBtnText, { color: amount ? '#FFF' : theme.icon }]}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

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
                      {item === 'FaceID' ? <Ionicons name="scan" size={32} color={theme.text} /> :
                       item === 'Del' ? <Ionicons name="backspace" size={32} color={theme.text} /> :
                       <Text style={{ fontSize: 28, color: theme.text }}>{item}</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {payState === 'scanning' && (
              <View style={styles.centerContainer}>
                <Text style={[styles.amountText, { color: theme.text, fontSize: 32 }]}>₦ {amount}</Text>
                <Ionicons name="wifi" size={80} color={theme.tint} style={{ transform: [{ rotate: '90deg' }], marginVertical: 20 }} />
                <Text style={[styles.statusText, { color: theme.text }]}>Tap {selectedUser?.name}'s phone now...</Text>
                <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 20 }} />
              </View>
            )}

            {payState === 'success' && (
              <View style={styles.centerContainer}>
                <View style={[styles.successCircle, { backgroundColor: theme.tint }]}>
                  <Ionicons name="checkmark" size={60} color="#FFFFFF" />
                </View>
                <Text style={[styles.amountText, { color: theme.text, marginTop: 20 }]}>Successful!</Text>
                <Text style={[styles.merchantText, { color: theme.icon, marginTop: 10 }]}>Sent ₦ {amount} to {selectedUser?.name}</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 600 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  centerContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 20 },
  amountInput: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  sendBtn: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  sendBtnText: { fontSize: 18, fontWeight: 'bold' },
  amountText: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  statusText: { fontSize: 18, fontWeight: '500' },
  successCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  merchantText: { fontSize: 16, marginBottom: 8 },
});
