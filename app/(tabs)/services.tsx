import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { id: '1', title: 'Airtime', icon: 'phone-portrait' },
  { id: '2', title: 'Data', icon: 'wifi' },
  { id: '3', title: 'Internet', icon: 'globe' },
  { id: '4', title: 'Electricity', icon: 'flash' },
  { id: '5', title: 'Cable TV', icon: 'tv' },
  { id: '6', title: 'Travel', icon: 'airplane' },
  { id: '7', title: 'Hotels', icon: 'bed' },
  { id: '8', title: 'Betting', icon: 'football' },
  { id: '9', title: 'Transport', icon: 'bus' },
  { id: '10', title: 'School', icon: 'school' },
  { id: '11', title: 'Water', icon: 'water' },
  { id: '12', title: 'Gift Cards', icon: 'gift' },
  { id: '13', title: 'Tickets', icon: 'ticket' },
  { id: '14', title: 'Donations', icon: 'heart' },
  { id: '15', title: 'Solar', icon: 'sunny' },
  { id: '16', title: 'Fuel Delivery', icon: 'car' },
];

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Services</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {services.map((s) => (
            <TouchableOpacity key={s.id} style={styles.gridItem}>
              <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                <Ionicons name={s.icon as any} size={28} color={theme.tint} />
              </View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>{s.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  content: { paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 12,
    textAlign: 'center',
  }
});
