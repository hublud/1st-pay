import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { QuickActions } from '@/components/QuickActions';
import { QuickAccessWidget } from '@/components/QuickAccessWidget';
import { MakePaymentButton } from '@/components/MakePaymentButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Golden Header with Gradient and Waves */}
        <LinearGradient
          colors={['#e8cc7d', '#d2b661', '#b89a4b']}
          style={styles.headerGradient}
        >
          {/* Wavy Background Patterns */}
          <View style={styles.wavesContainer}>
            <Svg height="100%" width="100%" viewBox={`0 0 ${width} 300`}>
              <Path
                d="M0 100 C 150 150 350 0 500 100 L 500 300 L 0 300 Z"
                fill="rgba(255, 255, 255, 0.1)"
                transform="translate(0, 20)"
              />
              <Path
                d="M0 150 C 200 200 400 50 600 150 L 600 300 L 0 300 Z"
                fill="rgba(255, 255, 255, 0.05)"
                transform="translate(-50, 40)"
              />
            </Svg>
          </View>

          <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerTop}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitials}>JN</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="grid-outline" size={22} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="ellipsis-horizontal" size={22} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.balanceSection}>
              <Text style={styles.personalLabel}>Personal - NGN 🇳🇬</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceText}>
                  {showBalance ? '₦ 1,450,000.50' : '₦ ••••••••'}
                </Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                  <Ionicons 
                    name={showBalance ? "eye-outline" : "eye-off-outline"} 
                    size={22} 
                    color="#000" 
                    style={styles.eyeIcon} 
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.accountBadge}>
                <Text style={styles.accountNumberText}>8023456789</Text>
                <Ionicons name="chevron-forward" size={14} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Circular Quick Actions */}
            <QuickActions />

            {/* Make Payment Button */}
            <View style={{ marginTop: 20 }}>
              <MakePaymentButton />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Bottom Section - White Background Container */}
        <View style={[styles.bottomContainer, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
          {/* Quick Access Section (Previous Content) */}
          <QuickAccessWidget />


          {/* Activity Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity</Text>
              <TouchableOpacity onPress={() => router.push('/spending')}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            <ActivityItem 
              name="ALIYU KHALIFA ZAKARI" 
              time="Transfer Inflow • 5:02PM" 
              amount="+ ₦500.00" 
              isPositive 
            />
            <ActivityItem 
              name="Netflix Subscription" 
              time="Card Payment • 11:30AM" 
              amount="- ₦4,500.00" 
              isPositive={false}
            />
            <ActivityItem 
              name="MTN Airtime" 
              time="Airtime Purchase • Yesterday" 
              amount="- ₦2,000.00" 
              isPositive={false}
            />
          </View>

          {/* Updates Section (Luxurious Style) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Updates</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={{ marginTop: 8 }}>
              <LinearGradient
                colors={['#d2b661', '#b89a4b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumCard}
              >
                <View style={styles.premiumCardContent}>
                  <View style={styles.premiumIconContainer}>
                    <Ionicons name="sparkles" size={24} color="#000" />
                  </View>
                  <View style={styles.premiumTextContainer}>
                    <Text style={styles.premiumTitle}>Get 1ST Premium</Text>
                    <Text style={styles.premiumDesc}>Enjoy zero transfer fees and exclusive rewards.</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(0,0,0,0.5)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


function ActivityItem({ name, time, amount, isPositive }: { name: string, time: string, amount: string, isPositive: boolean }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { borderColor: isDark ? '#333' : '#eee' }]}>
        <View style={styles.activityCircleInner} />
      </View>
      <View style={styles.activityDetails}>
        <Text style={[styles.activityName, { color: isDark ? '#FFF' : '#000' }]}>{name}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
      <Text style={[styles.activityAmount, { color: isPositive ? '#22c55e' : '#ef4444' }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingBottom: 40,
    minHeight: 380,
  },
  wavesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  personalLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  eyeIcon: {
    marginTop: 4,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  accountNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  bottomContainer: {
    flex: 1,
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#d2b661',
    fontWeight: '600',
  },
  suggestionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionItem: {
    alignItems: 'center',
    width: '22%',
  },
  suggestionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  premiumCard: {
    borderRadius: 20,
    padding: 2,
    elevation: 8,
    shadowColor: '#d2b661',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  premiumCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
  },
  premiumIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  premiumDesc: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.7)',
    lineHeight: 18,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityCircleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#22c55e',
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#888',
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});
