import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PayState = 'input_amount' | 'scanning' | 'success';

export function MakePaymentButton() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [modalVisible, setModalVisible] = useState(false);
  const [payState, setPayState] = useState<PayState>('input_amount');
  const [amount, setAmount] = useState('');

  // When modal opens
  useEffect(() => {
    if (modalVisible) {
      setPayState('input_amount');
      setAmount('');
    }
  }, [modalVisible]);

  // Handle Scanning Simulation
  useEffect(() => {
    if (payState === 'scanning') {
      const timer = setTimeout(() => {
        setPayState('success');
        // Auto close after success
        setTimeout(() => setModalVisible(false), 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [payState]);

  return (
    <>
      <TouchableOpacity 
        style={[styles.fullWidthBtn, { backgroundColor: theme.text }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="scan" size={24} color={theme.background} />
        <Text style={[styles.btnText, { color: theme.background }]}>Make Payment</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {payState === 'input_amount' && 'Enter Amount'}
                {payState === 'scanning' && 'NFC Payment'}
                {payState === 'success' && 'Done'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {payState === 'input_amount' && (
              <View style={styles.centerContainer}>
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
                  onPress={() => setPayState('scanning')}
                >
                  <Text style={[styles.sendBtnText, { color: amount ? '#FFF' : theme.icon }]}>Proceed</Text>
                </TouchableOpacity>
              </View>
            )}

            {payState === 'scanning' && (
              <View style={styles.centerContainer}>
                <Text style={[styles.amountText, { color: theme.text, fontSize: 32 }]}>₦ {amount}</Text>
                <Ionicons name="wifi" size={80} color={theme.tint} style={{ transform: [{ rotate: '90deg' }], marginVertical: 20 }} />
                <Text style={[styles.statusText, { color: theme.text }]}>Tap on the POS device now...</Text>
                <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 20 }} />
              </View>
            )}

            {payState === 'success' && (
              <View style={styles.centerContainer}>
                <View style={[styles.successCircle, { backgroundColor: theme.tint }]}>
                  <Ionicons name="checkmark" size={60} color="#FFFFFF" />
                </View>
                <Text style={[styles.amountText, { color: theme.text, marginTop: 20 }]}>Successful!</Text>
                <Text style={[styles.merchantText, { color: theme.icon, marginTop: 10 }]}>Paid ₦ {amount} to Supermarket</Text>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fullWidthBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 16, 
    borderRadius: 16, 
    marginHorizontal: 20,
    marginTop: 24,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4,
  },
  btnText: { marginLeft: 12, fontWeight: 'bold', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 450 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  centerContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  statusText: { fontSize: 18, fontWeight: '500' },
  merchantText: { fontSize: 16, marginBottom: 8 },
  amountText: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  successCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  amountInput: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  sendBtn: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  sendBtnText: { fontSize: 18, fontWeight: 'bold' }
});
