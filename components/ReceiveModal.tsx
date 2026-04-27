import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function ReceiveModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [receiveState, setReceiveState] = useState<'waiting' | 'success'>('waiting');

  useEffect(() => {
    if (visible) {
      setReceiveState('waiting');
      // Simulate receiving payment after 4 seconds
      const timer = setTimeout(() => {
        setReceiveState('success');
        setTimeout(() => onClose(), 2500); // Auto close
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Receive Payment</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {receiveState === 'waiting' && (
            <View style={styles.centerContainer}>
              <View style={[styles.qrContainer, { backgroundColor: '#FFF' }]}>
                <Ionicons name="qr-code" size={200} color="#000" />
              </View>
              <Text style={[styles.infoText, { color: theme.text }]}>Scan QR Code to pay Joshua Nwamife</Text>
              
              <View style={[styles.nfcDivider, { borderBottomColor: theme.surface }]} />
              
              <View style={styles.nfcContainer}>
                <Ionicons name="wifi" size={40} color={theme.tint} style={{ transform: [{ rotate: '90deg' }] }} />
                <View style={{ marginLeft: 16 }}>
                  <Text style={[styles.nfcTitle, { color: theme.text }]}>NFC Ready</Text>
                  <Text style={[styles.nfcDesc, { color: theme.icon }]}>Waiting for sender to send...</Text>
                </View>
              </View>
            </View>
          )}

          {receiveState === 'success' && (
            <View style={styles.centerContainer}>
              <View style={[styles.successCircle, { backgroundColor: theme.tint }]}>
                <Ionicons name="checkmark" size={80} color="#FFFFFF" />
              </View>
              <Text style={[styles.amountText, { color: theme.text, marginTop: 20 }]}>₦ 5,000.00</Text>
              <Text style={[styles.successText, { color: theme.icon, marginTop: 10 }]}>Received successfully from Charlie!</Text>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 500 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  centerContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  qrContainer: { padding: 16, borderRadius: 16, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  infoText: { fontSize: 16, fontWeight: '500', marginBottom: 32 },
  nfcDivider: { width: '100%', borderBottomWidth: 1, marginBottom: 32 },
  nfcContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(212, 175, 55, 0.1)' },
  nfcTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  nfcDesc: { fontSize: 14 },
  successCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  amountText: { fontSize: 36, fontWeight: 'bold' },
  successText: { fontSize: 18, fontWeight: '500', textAlign: 'center' }
});
