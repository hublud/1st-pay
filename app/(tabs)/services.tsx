import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const services = [
  { id: '1', title: 'Airtime', icon: '📱', route: '/airtime' },
  { id: '2', title: 'Data', icon: '📶' },
  { id: '3', title: 'Internet', icon: '🌐' },
  { id: '4', title: 'Electricity', icon: '⚡' },
  { id: '5', title: 'Cable TV', icon: '📺' },
  { id: '6', title: 'Travel', icon: '✈️' },
  { id: '7', title: 'Hotels', icon: '🏨' },
  { id: '8', title: 'Betting', icon: '⚽' },
  { id: '9', title: 'Transport', icon: '🚌' },
  { id: '10', title: 'School', icon: '🎓' },
  { id: '11', title: 'Water', icon: '💧' },
  { id: '12', title: 'Gift Cards', icon: '🎁' },
  { id: '13', title: 'Tickets', icon: '🎫' },
  { id: '14', title: 'Donations', icon: '❤️' },
  { id: '15', title: 'Solar', icon: '☀️' },
  { id: '16', title: 'Fuel Delivery', icon: '⛽' },
  { id: '17', title: 'POS Terminal', icon: '📟', route: '/pos' },
];

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const [displayMode, setDisplayMode] = useState<'grid' | 'carousel'>('grid');

  // Helper to chunk services into columns of 3 for carousel mode
  const chunkedServices = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < services.length; i += 3) {
      chunks.push(services.slice(i, i + 3));
    }
    return chunks;
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.text }]}>Services</Text>
          <TouchableOpacity 
            style={[styles.toggleBtn, { backgroundColor: theme.surface }]} 
            onPress={() => setDisplayMode(displayMode === 'grid' ? 'carousel' : 'grid')}
          >
            <Ionicons 
              name={displayMode === 'grid' ? 'list-outline' : 'grid-outline'} 
              size={24} 
              color={theme.tint} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {displayMode === 'grid' ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {services.map((s) => (
              <TouchableOpacity 
                key={s.id} 
                style={styles.gridItem}
                onPress={() => s.route && router.push(s.route as any)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isDark ? ['#2c2c2e', '#1c1c1e'] : ['#FFFFFF', '#F0F0F0']}
                  style={styles.icon3DContainer}
                >
                  <Text style={styles.emojiIcon}>{s.icon}</Text>
                  <View style={styles.iconShadow} />
                </LinearGradient>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{s.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.carouselContent}
          pagingEnabled={false}
          decelerationRate="fast"
        >
          {chunkedServices.map((column, colIdx) => (
            <View key={colIdx} style={styles.carouselColumn}>
              {column.map((s) => (
                <TouchableOpacity 
                  key={s.id} 
                  style={styles.carouselItem}
                  onPress={() => s.route && router.push(s.route as any)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={isDark ? ['#2c2c2e', '#1c1c1e'] : ['#FFFFFF', '#F0F0F0']}
                    style={[styles.icon3DContainer, { width: 80, height: 80 }]}
                  >
                    <Text style={[styles.emojiIcon, { fontSize: 38 }]}>{s.icon}</Text>
                    <View style={[styles.iconShadow, { width: 40 }]} />
                  </LinearGradient>
                  <Text style={[styles.itemTitle, { color: theme.text, fontSize: 13 }]}>{s.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold' },
  content: { paddingBottom: 60, paddingTop: 10 },
  carouselContent: { paddingHorizontal: 20, paddingTop: 20, height: '80%', alignItems: 'center' },
  carouselColumn: { marginRight: 20, justifyContent: 'space-between', height: 450 },
  carouselItem: { alignItems: 'center', width: 100 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: width / 4,
    alignItems: 'center',
    marginBottom: 28,
  },
  icon3DContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // 3D Shadow Effect
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  emojiIcon: {
    fontSize: 32,
    zIndex: 1,
  },
  iconShadow: {
    position: 'absolute',
    bottom: 8,
    width: 30,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    zIndex: 0,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  }
});
