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
};

const ALL_SERVICES: ServiceInfo[] = [
  { id: '1', name: 'Airtime', icon: 'phone-portrait' },
  { id: '2', name: 'Data', icon: 'wifi' },
  { id: '3', name: 'Electricity', icon: 'flash' },
  { id: '4', name: 'Internet', icon: 'globe' },
  { id: '5', name: 'Betting', icon: 'football' },
  { id: '6', name: 'Cable TV', icon: 'tv' },
  { id: '7', name: 'Transport', icon: 'car' },
  { id: '8', name: 'School', icon: 'school' },
  { id: '9', name: 'Water', icon: 'water' },
];

export function QuickAccessWidget() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceInfo[]>([
    ALL_SERVICES[0], ALL_SERVICES[1], ALL_SERVICES[2]
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
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Access</Text>
      
      <View style={styles.grid}>
        {selectedServices.map(service => (
          <TouchableOpacity 
            key={service.id} 
            style={[styles.serviceItem, { backgroundColor: theme.surface }]}
            onPress={() => {
              if (service.name === 'Airtime') router.push('/airtime');
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name={service.icon} size={24} color={theme.tint} />
            </View>
            <Text style={[styles.serviceName, { color: theme.text }]} numberOfLines={1}>{service.name}</Text>
            
            {/* Small minus badge to indicate removal */}
            <TouchableOpacity 
              style={[styles.removeBadge, { backgroundColor: theme.background }]}
              onPress={() => toggleService(service)}
            >
              <Ionicons name="remove-circle" size={16} color="#e74c3c" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.serviceItem, styles.dashedItem, { borderColor: theme.icon }]}
          onPress={() => setModalVisible(true)}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'transparent' }]}>
            <Ionicons name="add" size={32} color={theme.icon} />
          </View>
          <Text style={[styles.serviceName, { color: theme.icon }]}>Add More</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Manage Quick Access</Text>
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
                    <Ionicons name={service.icon} size={24} color={isSelected ? theme.tint : theme.text} />
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
  container: { marginTop: 32, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceItem: { 
    width: '22%', 
    aspectRatio: 0.85, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 8,
    position: 'relative'
  },
  dashedItem: { borderWidth: 1, borderStyle: 'dashed', backgroundColor: 'transparent' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceName: { fontSize: 11, textAlign: 'center', fontWeight: '500' },
  removeBadge: { position: 'absolute', top: -4, right: -4, borderRadius: 8 },
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
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  modalServiceName: { fontSize: 14, fontWeight: '500', flex: 1, marginLeft: 12 },
  checkIcon: { position: 'absolute', right: 12 },
  doneBtn: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  doneBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
