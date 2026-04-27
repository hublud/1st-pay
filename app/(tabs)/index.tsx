import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { BalanceCard } from '@/components/BalanceCard';
import { QuickActions } from '@/components/QuickActions';
import { MakePaymentButton } from '@/components/MakePaymentButton';
import { QuickAccessWidget } from '@/components/QuickAccessWidget';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.icon }]}>Good Morning,</Text>
          <Text style={[styles.username, { color: theme.text }]}>Joshua Nwamife</Text>
        </View>
        <View style={styles.profilePic}>
          <Text style={styles.profileText}>JN</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BalanceCard />
        
        <MakePaymentButton />

        <QuickActions />

        <QuickAccessWidget />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Updates</Text>
          <View style={[styles.updateCard, { backgroundColor: theme.tint }]}>
            <Text style={styles.updateTitle}>Get 1ST Premium</Text>
            <Text style={styles.updateDesc}>Enjoy zero transfer fees and exclusive rewards.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#000',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderCard: {
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  updateCard: {
    padding: 20,
    borderRadius: 16,
  },
  updateTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  updateDesc: {
    color: '#000',
    opacity: 0.8,
  }
});
