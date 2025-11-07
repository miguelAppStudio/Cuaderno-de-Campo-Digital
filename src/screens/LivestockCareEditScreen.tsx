
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { LivestockCare, LivestockCareEditScreenProps } from '../types';
import { BackIcon, SaveIcon } from '../components/icons';

const LivestockCareEditScreen: React.FC<LivestockCareEditScreenProps> = ({ route, navigation }) => {
  const { animalId, careId } = route.params;
  const [care, setCare] = useAsyncStorage<LivestockCare[]>('livestock_care', []);
  const [currentItem, setCurrentItem] = useState<Partial<LivestockCare>>({
      animalId,
      type: 'tratamiento',
      product: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
  });
  const isEditing = !!careId;

  const careTypes: { value: LivestockCare['type']; label: string }[] = [
    { value: 'vacuna', label: 'Vacuna' },
    { value: 'tratamiento', label: 'Tratamiento' },
    { value: 'alimentacion', label: 'Alimentación Especial' },
    { value: 'otro', label: 'Otro Cuidado' },
  ];

  useEffect(() => {
    if (isEditing) {
      const itemToEdit = care.find(c => c.id === careId);
      if (itemToEdit) setCurrentItem(itemToEdit);
    }
  }, [careId, care, isEditing]);

  const handleSave = () => {
    if (!currentItem.product?.trim() || !currentItem.date) {
      Alert.alert("Campos requeridos", "El producto y la fecha son obligatorios.");
      return;
    }

    if (isEditing) {
      setCare(care.map(c => (c.id === careId ? (currentItem as LivestockCare) : c)));
    } else {
      const newItem: LivestockCare = {
        id: Date.now().toString(),
        animalId: currentItem.animalId || '',
        type: currentItem.type || 'otro',
        product: currentItem.product || '',
        date: currentItem.date || '',
        notes: currentItem.notes || '',
      };
      setCare([...care, newItem]);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 border-b border-border bg-surface">
        {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full active:bg-gray-200">
          <BackIcon color="#1e293b" width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-primary">{isEditing ? 'Editar Cuidado' : 'Nuevo Cuidado'}</Text>
        <TouchableOpacity onPress={handleSave} className="p-2 rounded-full bg-primary active:bg-primary-dark">
          <SaveIcon color="white" width={24} height={24} />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="space-y-4">
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Tipo de Cuidado</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={currentItem.type} onValueChange={type => setCurrentItem({...currentItem, type: type as LivestockCare['type']})} style={styles.picker}>
                        {careTypes.map(ct => <Picker.Item key={ct.value} label={ct.label} value={ct.value} />)}
                    </Picker>
                </View>
            </View>
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Producto / Tratamiento</Text>
                <TextInput value={currentItem.product} onChangeText={product => setCurrentItem({...currentItem, product})} style={styles.input}/>
            </View>
             <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Fecha</Text>
                <TextInput value={currentItem.date} onChangeText={date => setCurrentItem({...currentItem, date})} placeholder="YYYY-MM-DD" style={styles.input}/>
            </View>
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Notas</Text>
                <TextInput value={currentItem.notes} onChangeText={notes => setCurrentItem({...currentItem, notes})} multiline textAlignVertical="top" style={[styles.input, {height: 100}]}/>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1e293b',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
    },
    picker: {
        color: '#1e293b',
    }
});

export default LivestockCareEditScreen;