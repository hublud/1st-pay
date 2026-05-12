import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, TextInput, Modal, ActivityIndicator, Animated, Easing, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SupermarketPaymentScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [amount, setAmount] = useState('');
  const [payState, setPayState] = useState<'amount' | 'pin' | 'tapping' | 'success'>('amount');
  const [pin, setPin] = useState('');
  
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (payState === 'tapping') {
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
    } else {
      pulseAnim.setValue(0);
    }
  }, [payState]);

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

  const handleAmountSubmit = () => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (numAmount < 15000) {
        setPayState('tapping');
        // Simulate tap success after delay
        setTimeout(() => {
          setPayState('success');
        }, 3000);
      } else {
        setPayState('pin');
      }
    }
  };

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      setPayState('tapping');
      // Simulate tap delay
      setTimeout(() => {
        setPayState('success');
      }, 3000);
    }
  };

  const renderKeypad = (value: string, setValue: (v: string) => void, onDone: () => void, isPin: boolean = false) => {
    const keys = isPin 
      ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'fingerprint', '0', '⌫']
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
    
    return (
      <View style={styles.keypad}>
        {keys.map((key) => (
          <TouchableOpacity 
            key={key} 
            style={styles.key} 
            onPress={() => {
              if (key === '⌫') setValue(value.slice(0, -1));
              else if (key === 'fingerprint') {
                // Simulate biometric auth
                setValue('1234');
                setTimeout(onDone, 100);
              }
              else if (key === '.' && value.includes('.')) return;
              else setValue(value + key);
            }}
          >
            {key === 'fingerprint' ? (
              <Ionicons name="finger-print" size={32} color="#d2b661" />
            ) : (
              <Text style={[styles.keyText, { color: theme.text }]}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['#d2b661', '#b89a4b']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make Transfer</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {payState === 'amount' && (
          <View style={styles.stepContainer}>
            <Text style={[styles.label, { color: theme.icon }]}>Enter Amount</Text>
            <View style={styles.amountDisplay}>
              <Text style={[styles.currency, { color: theme.text }]}>₦</Text>
              <Text style={[styles.amountText, { color: theme.text }]}>{amount || '0'}</Text>
            </View>
            {renderKeypad(amount, setAmount, handleAmountSubmit)}
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: '#000', opacity: amount ? 1 : 0.5 }]} 
              onPress={handleAmountSubmit}
              disabled={!amount}
            >
              <Text style={styles.buttonText}>Confirm Amount</Text>
            </TouchableOpacity>
          </View>
        )}

        {payState === 'pin' && (
          <View style={styles.stepContainer}>
            <Text style={[styles.label, { color: theme.icon }]}>Enter Transaction PIN</Text>
            <View style={styles.pinContainer}>
              {[1, 2, 3, 4].map((_, i) => (
                <View key={i} style={[styles.pinDot, { backgroundColor: pin.length > i ? '#d2b661' : theme.surface }]} />
              ))}
            </View>
            {renderKeypad(pin, (v) => { if (v.length <= 4) setPin(v) }, handlePinSubmit, true)}
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: '#000', opacity: pin.length === 4 ? 1 : 0.5 }]} 
              onPress={handlePinSubmit}
              disabled={pin.length !== 4}
            >
              <Text style={styles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {payState === 'tapping' && (
        <View style={styles.centerFullScreen}>
          <View style={styles.tapIconContainer}>
            <Animated.View style={[
              styles.pulseLayer, 
              { 
                backgroundColor: '#d2b661', 
                opacity: pulseOpacity1,
                transform: [{ scale: pulseScale1 }]
              }
            ]} />
            <Animated.View style={[
              styles.pulseLayer, 
              { 
                backgroundColor: '#d2b661', 
                opacity: pulseOpacity2,
                transform: [{ scale: pulseScale2 }]
              }
            ]} />
            <LinearGradient colors={['#d2b661', '#b89a4b']} style={styles.tapCircle}>
              <Ionicons name="radio-outline" size={80} color="#000" />
            </LinearGradient>
            <View style={styles.tappingAnimation}>
               <ActivityIndicator size="large" color="#d2b661" />
            </View>
          </View>
          <Text style={[styles.tapTitle, { color: theme.text }]}>Ready to Tap</Text>
          <Text style={[styles.tapSubtitle, { color: theme.icon }]}>
            Please hold your phone near the payment device to complete the transfer of ₦{amount}
          </Text>
        </View>
      )}

      {payState === 'success' && (
        <View style={styles.centerFullScreen}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={100} color="#22c55e" />
          </View>
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment Successful</Text>
          <Text style={[styles.successSubtitle, { color: theme.icon }]}>
            Successfully paid ₦{amount} to POS
          </Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: '#d2b661', marginTop: 40 }]} 
            onPress={() => router.replace('/')}
          >
            <Text style={[styles.buttonText, { color: '#000' }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  centerFullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currency: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 10,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  key: {
    width: '33%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapIconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  pulseLayer: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  tapCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#d2b661',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  tappingAnimation: {
    marginTop: 30,
  },
  tapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tapSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  }
});
