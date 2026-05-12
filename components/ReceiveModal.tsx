import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';

export function ReceiveModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [receiveState, setReceiveState] = useState<'waiting' | 'success'>('waiting');
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setReceiveState('waiting');
      
      // Continuous pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      ).start();

      // Simulate receiving payment after 8 seconds
      const timer = setTimeout(() => {
        setReceiveState('success');
        setTimeout(() => onClose(), 3000);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      pulseAnim.setValue(0);
    }
  }, [visible]);

  const pulseScale1 = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const pulseOpacity1 = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  const pulseScale2 = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 2.5],
  });

  const pulseOpacity2 = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.4, 0],
  });

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
              <View style={styles.nfcAnimContainer}>
                <Animated.View style={[
                  styles.nfcPulse, 
                  { 
                    backgroundColor: theme.tint, 
                    opacity: pulseOpacity1,
                    transform: [{ scale: pulseScale1 }]
                  }
                ]} />
                <Animated.View style={[
                  styles.nfcPulse, 
                  { 
                    backgroundColor: theme.tint, 
                    opacity: pulseOpacity2,
                    transform: [{ scale: pulseScale2 }]
                  }
                ]} />
                <LinearGradient
                  colors={['#d2b661', '#b89a4b']}
                  style={styles.nfcCircle}
                >
                  <Ionicons name="radio-outline" size={60} color="#000" />
                </LinearGradient>
              </View>
              
              <Text style={[styles.infoTitle, { color: theme.text }]}>NFC Ready</Text>
              <Text style={[styles.infoSubtitle, { color: theme.icon }]}>Tap on my device to send to me</Text>
              
              <View style={styles.deviceMockup}>
                 <Ionicons name="phone-portrait-outline" size={40} color={theme.icon} />
                 <Ionicons name="arrow-down" size={24} color={theme.tint} style={styles.arrowAnim} />
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
  centerContainer: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingVertical: 20 },
  nfcAnimContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  nfcPulse: { position: 'absolute', width: 180, height: 180, borderRadius: 90 },
  nfcCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#d2b661', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  infoTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  infoSubtitle: { fontSize: 16, textAlign: 'center', opacity: 0.8 },
  deviceMockup: { marginTop: 40, alignItems: 'center' },
  arrowAnim: { marginTop: 10 },
  successCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  amountText: { fontSize: 36, fontWeight: 'bold' },
  successText: { fontSize: 18, fontWeight: '500', textAlign: 'center' }
});
