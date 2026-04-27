import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ReceiveModal } from './ReceiveModal';

type Route = '/payment' | '/services' | '/cards' | '/profile' | null;

const actions: { id: string, title: string, icon: string, route: Route | '/spending' }[] = [
  { id: 'receive', title: 'Receive', icon: 'arrow-down-circle', route: null },
  { id: 'transfer', title: 'Transfer', icon: 'send', route: '/payment' },
  { id: 'services', title: 'Services', icon: 'grid', route: '/services' },
  { id: 'spending', title: 'Spending', icon: 'pie-chart', route: '/spending' },
];

export function QuickActions() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [receiveVisible, setReceiveVisible] = useState(false);

  const handlePress = (id: string, route: Route) => {
    if (id === 'receive') {
      setReceiveVisible(true);
    } else if (route) {
      router.push(route);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {actions.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.actionItem}
            onPress={() => handlePress(action.id, action.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
              <Ionicons name={action.icon as any} size={24} color={theme.tint} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ReceiveModal visible={receiveVisible} onClose={() => setReceiveVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
  }
});
