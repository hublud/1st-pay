import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ServiceInfo = {
  id: string;
  name: string;
  icon: string;
};

const ALL_SERVICES: ServiceInfo[] = [
  { id: '1', name: 'Airtime', icon: '📱' },
  { id: '2', name: 'Data', icon: '📶' },
  { id: '3', name: 'Electricity', icon: '⚡' },
  { id: '4', name: 'Internet', icon: '🌐' },
  { id: '5', name: 'Betting', icon: '⚽' },
  { id: '6', name: 'Cable TV', icon: '📺' },
  { id: '7', name: 'Transport', icon: '🚌' },
  { id: '8', name: 'School', icon: '🎓' },
  { id: '9', name: 'Water', icon: '💧' },
];

export function QuickAccessWidget() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceInfo[]>([
    ALL_SERVICES[0], ALL_SERVICES[1], ALL_SERVICES[2], ALL_SERVICES[3]
  ]);

  const toggleService = (service: ServiceInfo) => {
    if (selectedServices.find(s => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      }
    } else {
      if (selectedServices.length < 8) {
        setSelectedServices([...selectedServices, service]);
      }
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
            <LinearGradient
              colors={isDark ? ['#2c2c2e', '#1c1c1e'] : ['#FFFFFF', '#F0F0F0']}
              style={styles.icon3DContainer}
            >
              <Text style={styles.emojiIcon}>{service.icon}</Text>
              <View style={styles.iconShadow} />
            </LinearGradient>
            <Text style={[styles.serviceName, { color: theme.text }]} numberOfLines={1}>{service.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.serviceItem}
          onPress={() => setModalVisible(true)}
        >
          <View style={[styles.icon3DContainer, { backgroundColor: theme.surface, elevation: 0, shadowOpacity: 0 }]}>
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
                    <View style={styles.modalIconBox}>
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
              style={[styles.doneBtn, { backgroundColor: '#d2b661' }]}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    gap: 0 
  },
  serviceItem: { 
    width: (width - 40) / 4, 
    alignItems: 'center', 
    marginBottom: 20
  },
  icon3DContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  emojiIcon: {
    fontSize: 26,
    zIndex: 1,
  },
  iconShadow: {
    position: 'absolute',
    bottom: 6,
    width: 24,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    zIndex: 0,
  },
  serviceName: { fontSize: 11, textAlign: 'center', fontWeight: '600', opacity: 0.8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: 500, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  modalSubtitle: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 },
  modalServiceItem: { 
    width: '48%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 16, 
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalServiceName: { fontSize: 14, fontWeight: '600', flex: 1, marginLeft: 12 },
  checkIcon: { position: 'absolute', right: 12 },
  doneBtn: { width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  doneBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
