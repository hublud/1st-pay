import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, ScaleInCenter, ScaleOutCenter, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type POSStep = 'IDLE' | 'PAYMENT_MODE' | 'PROCESSING' | 'SUCCESS' | 'FAILURE';
type PaymentMethod = 'CARD' | 'TRANSFER' | 'QR' | null;

export default function POSScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [amount, setAmount] = useState('0');
  const [step, setStep] = useState<POSStep>('IDLE');
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  // calcEntry: what the user is currently typing
  // calcExpression: shown in the top line e.g. "88 +"
  // calcResult: shown after = is pressed
  const [calcEntry, setCalcEntry] = useState('0');
  const [calcExpression, setCalcExpression] = useState('');
  const [calcFirstValue, setCalcFirstValue] = useState<number | null>(null);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcJustEvaled, setCalcJustEvaled] = useState(false);

  const compute = (a: number, op: string, b: number): number => {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return b !== 0 ? a / b : 0;
    return b;
  };

  const handleCalc = (val: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (val === 'C') {
      setCalcEntry('0');
      setCalcExpression('');
      setCalcFirstValue(null);
      setCalcOperator(null);
      setCalcJustEvaled(false);
      return;
    }

    if (val === 'DEL') {
      if (calcJustEvaled) return; // don't del a result
      setCalcEntry(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      return;
    }

    if (val === '=') {
      if (calcOperator !== null && calcFirstValue !== null) {
        const b = parseFloat(calcEntry);
        const result = compute(calcFirstValue, calcOperator, b);
        const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
        setCalcExpression(`${calcFirstValue} ${calcOperator} ${b} =`);
        setCalcEntry(resultStr);
        setCalcFirstValue(null);
        setCalcOperator(null);
        setCalcJustEvaled(true);
      }
      return;
    }

    if (['+', '-', '*', '/'].includes(val)) {
      const current = parseFloat(calcEntry);
      // if there's already a pending operation, resolve it first
      if (calcOperator !== null && calcFirstValue !== null && !calcJustEvaled) {
        const result = compute(calcFirstValue, calcOperator, current);
        setCalcFirstValue(result);
        setCalcExpression(`${result} ${val}`);
      } else {
        setCalcFirstValue(calcJustEvaled ? current : current);
        setCalcExpression(`${current} ${val}`);
      }
      setCalcOperator(val);
      setCalcEntry('0');
      setCalcJustEvaled(false);
      return;
    }

    // digit input
    if (calcJustEvaled) {
      // start fresh after a result
      setCalcEntry(val);
      setCalcExpression('');
      setCalcFirstValue(null);
      setCalcOperator(null);
      setCalcJustEvaled(false);
    } else {
      setCalcEntry(prev => prev === '0' ? val : prev + val);
    }
  };

  const handleKeyPress = (key: string) => {
    if (step !== 'IDLE') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (key === 'DEL') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setAmount(prev => prev === '0' ? key : prev + key);
    }
  };

  const formatAmount = (val: string) => {
    const num = parseFloat(val) / 100;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  };

  const startPayment = () => {
    if (amount === '0') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep('PAYMENT_MODE');
  };

  const selectMethod = (m: PaymentMethod) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMethod(m);
    setStep('PROCESSING');
    
    // Simulate processing
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep('SUCCESS');
    }, 3000);
  };

  const reset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAmount('0');
    setStep('IDLE');
    setMethod(null);
  };

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(withSequence(withTiming(0.4, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true),
    transform: [{ scale: withRepeat(withSequence(withTiming(1, { duration: 1000 }), withTiming(1.1, { duration: 1000 })), -1, true) }]
  }));

  const KeypadButton = ({ label, icon, onPress, variant = 'default' }: any) => (
    <TouchableOpacity 
      style={[
        styles.keypadBtn, 
        { backgroundColor: theme.surface },
        variant === 'action' && { backgroundColor: theme.tint }
      ]} 
      onPress={onPress}
    >
      {icon ? <Ionicons name={icon} size={28} color={variant === 'action' ? '#FFF' : theme.text} /> : 
             <Text style={[styles.keypadText, { color: variant === 'action' ? '#FFF' : theme.text }]}>{label}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>1ST PAY TERMINAL</Text>
          <View style={styles.statusIcons}>
            <TouchableOpacity onPress={() => setShowCalculator(true)} style={styles.headerIcon}>
              <Ionicons name="calculator-outline" size={20} color={theme.tint} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/pos-history')} style={styles.headerIcon}>
              <Ionicons name="stats-chart" size={20} color={theme.tint} />
            </TouchableOpacity>
            <Ionicons name="wifi" size={16} color={theme.tint} style={{ marginRight: 8 }} />
            <Ionicons name="battery-full" size={16} color={theme.tint} />
          </View>
        </View>
      </View>

      {/* Main Display */}
      <View style={styles.displayArea}>
        <Animated.View entering={FadeIn.duration(400)} key={step} style={{ alignItems: 'center' }}>
          {step === 'IDLE' && (
            <Animated.View style={[styles.nfcIndicator, pulseStyle]}>
              <Ionicons name="wifi" size={32} color={theme.tint} style={{ transform: [{ rotate: '90deg' }] }} />
              <Text style={[styles.nfcText, { color: theme.tint }]}>READY TO TAP</Text>
            </Animated.View>
          )}

          {step === 'IDLE' || step === 'PAYMENT_MODE' ? (
            <View style={styles.amountContainer}>
              <Text style={[styles.currencyLabel, { color: theme.icon }]}>Transaction Amount</Text>
              <Text style={[styles.amountText, { color: theme.text }]}>{formatAmount(amount)}</Text>
            </View>
          ) : null}
        </Animated.View>

        {step === 'PROCESSING' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.statusContainer}>
            <Animated.View style={[styles.nfcLargeIcon, pulseStyle]}>
              <Ionicons name="wifi" size={80} color={theme.tint} style={{ transform: [{ rotate: '90deg' }] }} />
            </Animated.View>
            <Text style={[styles.statusText, { color: theme.text }]}>
              {method === 'CARD' ? 'Tap Phone on Device' : method === 'TRANSFER' ? 'Awaiting transfer...' : 'Generating QR code...'}
            </Text>
            <ActivityIndicator size="small" color={theme.tint} style={{ marginTop: 12 }} />
          </Animated.View>
        )}

        {step === 'SUCCESS' && (
          <Animated.View entering={ScaleInCenter} style={styles.statusContainer}>
            <View style={[styles.successCircle, { backgroundColor: theme.tint }]}>
              <Ionicons name="checkmark" size={60} color="#FFF" />
            </View>
            <Text style={[styles.statusTitle, { color: theme.text }]}>PAYMENT SUCCESS</Text>
            <Text style={[styles.statusSubtitle, { color: theme.icon }]}>Transaction ID: TXN-902345678</Text>
            
            <View style={[styles.receiptCard, { backgroundColor: theme.surface }]}>
              <View style={styles.receiptRow}>
                <Text style={{ color: theme.icon }}>Amount</Text>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>{formatAmount(amount)}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={{ color: theme.icon }}>Method</Text>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>{method}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={{ color: theme.icon }}>Date</Text>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.tint }]} onPress={reset}>
              <Text style={styles.actionBtnText}>NEW TRANSACTION</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Interaction Area */}
      {step === 'IDLE' && (
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            <KeypadButton label="1" onPress={() => handleKeyPress('1')} />
            <KeypadButton label="2" onPress={() => handleKeyPress('2')} />
            <KeypadButton label="3" onPress={() => handleKeyPress('3')} />
          </View>
          <View style={styles.keypadRow}>
            <KeypadButton label="4" onPress={() => handleKeyPress('4')} />
            <KeypadButton label="5" onPress={() => handleKeyPress('5')} />
            <KeypadButton label="6" onPress={() => handleKeyPress('6')} />
          </View>
          <View style={styles.keypadRow}>
            <KeypadButton label="7" onPress={() => handleKeyPress('7')} />
            <KeypadButton label="8" onPress={() => handleKeyPress('8')} />
            <KeypadButton label="9" onPress={() => handleKeyPress('9')} />
          </View>
          <View style={styles.keypadRow}>
            <KeypadButton label="00" onPress={() => handleKeyPress('00')} />
            <KeypadButton label="0" onPress={() => handleKeyPress('0')} />
            <KeypadButton icon="backspace-outline" onPress={() => handleKeyPress('DEL')} />
          </View>
          <View style={styles.payRow}>
            <TouchableOpacity 
              style={[styles.payBtn, { backgroundColor: amount !== '0' ? theme.tint : theme.surface }]}
              onPress={startPayment}
              disabled={amount === '0'}
            >
              <Text style={[styles.payBtnText, { color: amount !== '0' ? '#FFF' : theme.icon }]}>CONTINUE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.calcQuickBtn, { backgroundColor: theme.surface }]}
              onPress={() => setShowCalculator(true)}
            >
              <Ionicons name="calculator-outline" size={28} color={theme.tint} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'PAYMENT_MODE' && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.modeContainer}>
          <Text style={[styles.modeTitle, { color: theme.text }]}>Select Payment Method</Text>
          <View style={styles.modeGrid}>
            {[
              { id: 'CARD', label: 'Receive', icon: 'card-outline' },
              { id: 'TRANSFER', label: 'Transfer', icon: 'swap-horizontal-outline' },
              { id: 'QR', label: 'QR Pay', icon: 'qr-code-outline' },
            ].map((m) => (
              <TouchableOpacity 
                key={m.id} 
                style={[styles.modeItem, { backgroundColor: theme.surface }]}
                onPress={() => selectMethod(m.id as PaymentMethod)}
              >
                <Ionicons name={m.icon as any} size={32} color={theme.tint} />
                <Text style={[styles.modeLabel, { color: theme.text }]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep('IDLE')}>
            <Text style={[styles.cancelBtnText, { color: theme.icon }]}>CANCEL</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Calculator Modal */}
      <Modal visible={showCalculator} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.calcModal, { backgroundColor: theme.background }]}>
            <View style={styles.calcHeader}>
              <Text style={[styles.calcTitle, { color: theme.text }]}>CALCULATOR</Text>
              <TouchableOpacity onPress={() => setShowCalculator(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {/* Two-line display */}
            <View style={[styles.calcDisplay, { backgroundColor: theme.surface }]}>
              <Text style={[styles.calcExpressionText, { color: theme.icon }]} numberOfLines={1}>{calcExpression}</Text>
              <Text style={[styles.calcDisplayText, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>{calcEntry}</Text>
            </View>
            
            <View style={styles.calcGrid}>
              {[
                { label: 'C', type: 'action' },
                { label: 'DEL', type: 'action' },
                { label: '/', type: 'action' },
                { label: '*', type: 'action' },
                { label: '7', type: 'num' },
                { label: '8', type: 'num' },
                { label: '9', type: 'num' },
                { label: '-', type: 'action' },
                { label: '4', type: 'num' },
                { label: '5', type: 'num' },
                { label: '6', type: 'num' },
                { label: '+', type: 'action' },
                { label: '1', type: 'num' },
                { label: '2', type: 'num' },
                { label: '3', type: 'num' },
                { label: '=', type: 'equals' },
                { label: '0', type: 'num' },
                { label: '.', type: 'num' },
                { label: 'CLOSE', type: 'close' },
              ].map((btn) => (
                <TouchableOpacity 
                  key={btn.label} 
                  style={[
                    styles.calcBtn, 
                    btn.type === 'num' && { backgroundColor: theme.surface },
                    btn.type === 'action' && { backgroundColor: theme.tint },
                    btn.type === 'equals' && { backgroundColor: '#2ecc71' },
                    btn.type === 'close' && { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.tint, flex: 1, width: undefined },
                  ]}
                  onPress={() => btn.type === 'close' ? setShowCalculator(false) : handleCalc(btn.label)}
                >
                  <Text style={[
                    styles.calcBtnText, 
                    btn.type === 'num' && { color: theme.text },
                    btn.type === 'action' && { color: '#FFF' },
                    btn.type === 'equals' && { color: '#FFF' },
                    btn.type === 'close' && { color: theme.tint, fontSize: 14 },
                  ]}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    opacity: 0.6,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginRight: 8,
  },
  displayArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  amountContainer: {
    alignItems: 'center',
  },
  currencyLabel: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  nfcIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  nfcText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  nfcLargeIcon: {
    marginBottom: 24,
  },
  keypadContainer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  keypadBtn: {
    width: '30%',
    aspectRatio: 1.5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '600',
  },
  payBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  payBtn: {
    flex: 7,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  calcQuickBtn: {
    flex: 3,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  calcModal: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 500,
  },
  calcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calcTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  calcDisplay: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  calcDisplayText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  calcExpressionText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.7,
  },
  calcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  calcBtn: {
    width: '22%',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modeContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  modeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  modeItem: {
    width: '30%',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modeLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtn: {
    padding: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    marginBottom: 32,
  },
  receiptCard: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
