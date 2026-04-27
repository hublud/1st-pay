import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity, Dimensions, Modal, TextInput, Clipboard, Alert, Image } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');

type CardStatus = 'empty' | 'requesting' | 'active';

export default function CardsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [cardStatus, setCardStatus] = useState<CardStatus>('empty');
  const [isLocked, setIsLocked] = useState(false);
  const [cardName, setCardName] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const handleRequestCard = () => {
    setCardStatus('requesting');
  };

  const handleGenerateCard = () => {
    if (!cardName) {
      Alert.alert('Error', 'Please enter a name for your card');
      return;
    }
    setCardStatus('active');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Titanium Card</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {cardStatus === 'empty' && (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyCardPlaceholder, { borderColor: theme.icon + '40' }]}>
              <Ionicons name="card-outline" size={80} color={theme.icon + '40'} />
              <Text style={[styles.emptyText, { color: theme.icon }]}>No active virtual cards</Text>
            </View>
            <TouchableOpacity 
              style={[styles.requestBtn, { backgroundColor: theme.tint }]}
              onPress={handleRequestCard}
            >
              <Text style={styles.requestBtnText}>Request Virtual Card</Text>
            </TouchableOpacity>
          </View>
        )}

        {cardStatus === 'active' && (
          <View style={styles.activeContainer}>
            {/* Vertical Card Component */}
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => copyToClipboard('4532 1123 8900 4219', 'Card Number')}
              style={[styles.portraitCard, { opacity: isLocked ? 0.6 : 1 }]}
            >
              <View style={styles.cardGlow} />
              
              <View style={styles.cardHeader}>
                <Text style={styles.goldCardLabel}>Gold Card</Text>
                <View style={styles.chipAndNfc}>
                  <MaterialCommunityIcons name="chip" size={36} color="#E5C158" />
                  <Ionicons name="wifi" size={24} color="#E5C158" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
              </View>

              <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                   <View style={styles.logoTextGroup}>
                      <Text style={styles.logoMain}>1</Text>
                      <View style={{ paddingTop: 10 }}>
                        <Ionicons name="wifi" size={14} color="#E5C158" style={{ transform: [{ rotate: '45deg' }] }} />
                        <Text style={styles.logoSub}>ST</Text>
                      </View>
                   </View>
                </View>
              </View>

              <View style={styles.cardInfoSection}>
                <Text style={styles.bankName}>1ST PAY</Text>
                <Text style={styles.cardNumber}>4532  1123  8900  4219</Text>
                <View style={styles.cardDetailsRow}>
                  <View>
                    <Text style={styles.detailLabel}>Expiry</Text>
                    <Text style={styles.detailValue}>12/28</Text>
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>CVV</Text>
                    <Text style={styles.detailValue}>721</Text>
                  </View>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' }} style={styles.mcLogo} />
                </View>
                <Text style={styles.holderName}>{cardName.toUpperCase() || 'JOSHUA NWAMIFE'}</Text>
              </View>

              {isLocked && (
                <View style={styles.lockOverlay}>
                   <Ionicons name="lock-closed" size={48} color="#FFF" />
                   <Text style={styles.lockText}>LOCKED</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.physicalBadge}>
               <Ionicons name="card" size={16} color={theme.icon} />
               <Text style={[styles.physicalText, { color: theme.icon }]}>Physical</Text>
            </View>

            {/* Apple Wallet Button */}
            <TouchableOpacity style={styles.appleWalletBtn}>
               <Ionicons name="logo-apple" size={20} color="#FFF" />
               <Text style={styles.appleWalletText}>Add to Apple Wallet</Text>
            </TouchableOpacity>

            {/* Quick Actions Grid */}
            <View style={styles.actionsGrid}>
              {[
                { label: 'Order Physical Card', icon: 'card-outline', id: 'order' },
                { label: 'Manage Card', icon: 'settings-outline', id: 'manage' },
                { label: 'Temporarily Lock', icon: isLocked ? 'lock-open-outline' : 'lock-closed-outline', id: 'lock', active: isLocked },
                { label: 'Report Lost/Stolen', icon: 'alert-circle-outline', id: 'report', danger: true },
              ].map(action => (
                <TouchableOpacity 
                  key={action.id} 
                  style={styles.actionItem}
                  onPress={() => action.id === 'lock' && setIsLocked(!isLocked)}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: theme.surface }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.danger ? '#e74c3c' : (action.active ? theme.tint : theme.text)} />
                  </View>
                  <Text style={[styles.actionLabel, { color: theme.text }]}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Latest Transactions */}
            <View style={styles.transactionsSection}>
               <Text style={[styles.sectionTitle, { color: theme.text }]}>Latest Transactions</Text>
               <View style={styles.emptyTransactions}>
                  <View style={[styles.transIconContainer, { backgroundColor: theme.surface }]}>
                    <Ionicons name="document-text-outline" size={24} color={theme.icon} />
                  </View>
                  <Text style={[styles.emptyTransText, { color: theme.icon }]}>You haven't made any transactions yet</Text>
               </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Request Card Modal */}
      <Modal animationType="slide" transparent visible={cardStatus === 'requesting'}>
        <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Request Virtual Card</Text>
                <TouchableOpacity onPress={() => setCardStatus('empty')}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSubtitle, { color: theme.icon }]}>Customize your card details below.</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Name on Card</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                  placeholder="e.g. JOSHUA NWAMIFE"
                  placeholderTextColor={theme.icon}
                  value={cardName}
                  onChangeText={setCardName}
                  autoFocus
                />
              </View>

              <View style={styles.benefitRow}>
                 <Ionicons name="checkmark-circle" size={20} color={theme.tint} />
                 <Text style={[styles.benefitText, { color: theme.text }]}>Instant activation</Text>
              </View>
              <View style={styles.benefitRow}>
                 <Ionicons name="checkmark-circle" size={20} color={theme.tint} />
                 <Text style={[styles.benefitText, { color: theme.text }]}>Use worldwide anywhere Mastercard is accepted</Text>
              </View>

              <TouchableOpacity 
                style={[styles.generateBtn, { backgroundColor: theme.tint }]}
                onPress={handleGenerateCard}
              >
                <Text style={styles.generateBtnText}>Confirm & Generate Card</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { paddingBottom: 40 },
  
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 100, paddingHorizontal: 40 },
  emptyCardPlaceholder: { width: '100%', aspectRatio: 0.65, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '500' },
  requestBtn: { width: '100%', padding: 18, borderRadius: 16, alignItems: 'center' },
  requestBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  activeContainer: { paddingHorizontal: 20, alignItems: 'center' },
  portraitCard: {
    width: width * 0.75,
    aspectRatio: 0.63,
    borderRadius: 24,
    backgroundColor: '#2A1F3D', // Dark purple base
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  cardGlow: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(212, 175, 55, 0.1)', transform: [{ scale: 2 }] },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  goldCardLabel: { color: '#E5C158', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  chipAndNfc: { alignItems: 'center', gap: 4 },
  
  logoSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { alignItems: 'center' },
  logoTextGroup: { flexDirection: 'row', alignItems: 'flex-start' },
  logoMain: { fontSize: 120, fontWeight: '900', color: '#E5C158', lineHeight: 120 },
  logoSub: { fontSize: 32, fontWeight: '900', color: '#E5C158', marginTop: -5 },
  
  cardInfoSection: { },
  bankName: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  cardNumber: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 },
  cardDetailsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { color: '#AAA', fontSize: 8, textTransform: 'uppercase', marginBottom: 2 },
  detailValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mcLogo: { width: 32, height: 20, resizeMode: 'contain' },
  holderName: { color: '#FFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },

  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  lockText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 10 },

  physicalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  physicalText: { fontSize: 14, fontWeight: '500' },

  appleWalletBtn: { backgroundColor: '#000', width: '100%', height: 50, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  appleWalletText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginTop: 32, justifyContent: 'space-between', rowGap: 24 },
  actionItem: { width: '22%', alignItems: 'center', gap: 8 },
  actionIconContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 10, textAlign: 'center', fontWeight: '500' },

  transactionsSection: { width: '100%', marginTop: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  emptyTransactions: { alignItems: 'center', paddingVertical: 40 },
  transIconContainer: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTransText: { fontSize: 14, textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 450 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  modalSubtitle: { fontSize: 16, marginBottom: 32 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { padding: 16, borderRadius: 12, fontSize: 16, fontWeight: '600' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  benefitText: { fontSize: 14, flex: 1 },
  generateBtn: { width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 'auto' },
  generateBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
});
