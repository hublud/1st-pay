import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

type ServiceInfo = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  iconColor: string;
};

const ALL_SERVICES: ServiceInfo[] = [
  { id: '1', name: 'Airtime', icon: '📱' as any, color: '#fef2f2', iconColor: '#ef4444' },
  { id: '2', name: 'Data', icon: '📶' as any, color: '#f0fdf4', iconColor: '#22c55e' },
  { id: '3', name: 'Electricity', icon: '⚡' as any, color: '#fffbeb', iconColor: '#f59e0b' },
  { id: '4', name: 'Internet', icon: '🌐' as any, color: '#eff6ff', iconColor: '#3b82f6' },
  { id: '5', name: 'Betting', icon: '⚽' as any, color: '#f5f3ff', iconColor: '#8b5cf6' },
  { id: '6', name: 'Cable TV', icon: '📺' as any, color: '#fff1f2', iconColor: '#f43f5e' },
  { id: '7', name: 'Transport', icon: '🚌' as any, color: '#f0f9ff', iconColor: '#0ea5e9' },
  { id: '8', name: 'School', icon: '🎓' as any, color: '#fdf2f7', iconColor: '#ec4899' },
  { id: '9', name: 'Water', icon: '💧' as any, color: '#f0fdfa', iconColor: '#14b8a6' },
];

export function QuickAccessWidget() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceInfo[]>([
    ALL_SERVICES[0], ALL_SERVICES[1], ALL_SERVICES[2], ALL_SERVICES[3]
  ]);

  const toggleService = (service: ServiceInfo) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Suggestion</Text>
      </View>
      
      <View style={styles.grid}>
        {selectedServices.map(service => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.serviceItem}
            onPress={() => {
              if (service.name === 'Airtime') router.push('/airtime');
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
              <Text style={{ fontSize: 24 }}>{service.icon}</Text>
            </View>
            <Text style={[styles.serviceName, { color: theme.text }]} numberOfLines={1}>{service.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.serviceItem}
          onPress={() => setModalVisible(true)}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
            <Ionicons name="add" size={28} color={theme.icon} />
          </View>
          <Text style={[styles.serviceName, { color: theme.icon }]}>Add More</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Manage Suggestions</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: theme.icon }]}>Tap services to add or remove them from your home screen.</Text>

            <ScrollView contentContainerStyle={styles.modalGrid} showsVerticalScrollIndicator={false}>
              {ALL_SERVICES.map(service => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                return (
                  <TouchableOpacity 
                    key={service.id} 
                    style={[
                      styles.modalServiceItem, 
                      { backgroundColor: theme.surface },
                      isSelected && { borderColor: theme.tint, borderWidth: 1 }
                    ]}
                    onPress={() => toggleService(service)}
                  >
                    <View style={[styles.modalIconBox, { backgroundColor: service.color }]}>
                       <Text style={{ fontSize: 20 }}>{service.icon}</Text>
                    </View>
                    <Text style={[styles.modalServiceName, { color: theme.text }]}>{service.name}</Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={theme.tint} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <TouchableOpacity 
              style={[styles.doneBtn, { backgroundColor: theme.tint }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceItem: { 
    width: '22%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12
  },
  iconContainer: { 
    width: 56, 
    height: 56, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8 
  },
  serviceName: { fontSize: 11, textAlign: 'center', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 500, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalSubtitle: { fontSize: 14, marginBottom: 20 },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 },
  modalServiceItem: { 
    width: '48%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  modalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalServiceName: { fontSize: 14, fontWeight: '500', flex: 1, marginLeft: 12 },
  checkIcon: { position: 'absolute', right: 12 },
  doneBtn: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  doneBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
