import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReceiveModal } from './ReceiveModal';

const actions = [
  { id: 'receive', title: 'Receive', icon: 'arrow-down-circle', route: null },
  { id: 'transfer', title: 'Transfer', icon: 'send', route: '/payment' },
  { id: 'services', title: 'Services', icon: 'grid', route: '/services' },
  { id: 'spending', title: 'Spending', icon: 'pie-chart', route: '/spending' },
];

export function QuickActions() {
  const router = useRouter();
  const [receiveVisible, setReceiveVisible] = useState(false);

  const handlePress = (id: string, route: any) => {
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
            <View style={styles.iconContainer}>
              <Ionicons name={action.icon as any} size={24} color="#000" />
            </View>
            <Text style={styles.title}>{action.title}</Text>
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
    width: '100%',
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  }
});
