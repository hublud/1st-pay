import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity, Switch, Appearance } from 'react-native';
import { useColorScheme, setAppTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JN</Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>Joshua Nwamife</Text>
          <Text style={[styles.tag, { color: theme.icon }]}>@joshuanwamife</Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.premiumBanner, { backgroundColor: theme.tint }]}>
            <View>
              <Text style={styles.premiumTitle}>1ST Premium</Text>
              <Text style={styles.premiumDesc}>Active Member</Text>
            </View>
            <Ionicons name="star" size={32} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.settingsList}>
          <View style={[styles.settingRow, { borderBottomColor: theme.surface }]}>
            <View style={styles.settingIconText}>
              <Ionicons name="moon" size={24} color={theme.icon} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={(val) => setAppTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: theme.tint }}
              thumbColor={isDark ? '#FFF' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: theme.surface }]}>
            <View style={styles.settingIconText}>
              <Ionicons name="shield-checkmark" size={24} color={theme.icon} />
              <Text style={[styles.settingText, { color: theme.text }]}>Security & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>



          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: theme.surface }]}>
            <View style={styles.settingIconText}>
              <Ionicons name="help-circle" size={24} color={theme.icon} />
              <Text style={[styles.settingText, { color: theme.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: theme.surface, borderBottomWidth: 0 }]}>
            <View style={styles.settingIconText}>
              <Ionicons name="log-out" size={24} color="#e74c3c" />
              <Text style={[styles.settingText, { color: '#e74c3c' }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  content: { paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginTop: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#000' },
  name: { fontSize: 24, fontWeight: 'bold' },
  tag: { fontSize: 16, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 32 },
  premiumBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  premiumTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  premiumDesc: { color: '#FFFFFF', opacity: 0.9, marginTop: 4 },
  settingsList: { marginTop: 32, paddingHorizontal: 20 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingIconText: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  settingText: { fontSize: 16, fontWeight: '500' }
});
