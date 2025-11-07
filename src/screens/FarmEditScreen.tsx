
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { Farm, FarmEditScreenProps, FarmType } from '../types';
import { BackIcon, SaveIcon } from '../components/icons';

const FarmEditScreen: React.FC<FarmEditScreenProps> = ({ route, navigation }) => {
  const { farmId } = route.params;
  const [farms, setFarms] = useAsyncStorage<Farm[]>('farms', []);
  const [currentItem, setCurrentItem] = useState<Partial<Farm>>({ name: '', type: 'olivar', location: '', notes: '' });
  const isEditing = !!farmId;

  const farmTypes: { value: FarmType; label: string }[] = [
    { value: 'olivar', label: 'Olivar' },
    { value: 'pinar', label: 'Pinar' },
    { value: 'frutales', label: 'Árboles Frutales' },
    { value: 'otro', label: 'Otro' },
  ];

  useEffect(() => {
    if (isEditing) {
      const itemToEdit = farms.find(f => f.id === farmId);
      if (itemToEdit) setCurrentItem(itemToEdit);
    }
  }, [farmId, farms, isEditing]);

  const handleSave = () => {
    if (!currentItem.name?.trim() || !currentItem.location?.trim()) {
      Alert.alert("Campos requeridos", "El nombre y la ubicación son obligatorios.");
      return;
    }

    if (isEditing) {
      setFarms(farms.map(f => (f.id === farmId ? (currentItem as Farm) : f)));
    } else {
      const newItem: Farm = {
        id: Date.now().toString(),
        name: currentItem.name || '',
        type: currentItem.type || 'otro',
        location: currentItem.location || '',
        notes: currentItem.notes || '',
      };
      setFarms([...farms, newItem]);
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
        <Text className="text-2xl font-bold text-primary">{isEditing ? 'Editar Finca' : 'Nueva Finca'}</Text>
        <TouchableOpacity onPress={handleSave} className="p-2 rounded-full bg-primary active:bg-primary-dark">
          <SaveIcon color="white" width={24} height={24} />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="space-y-4">
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Nombre de la Finca</Text>
                <TextInput value={currentItem.name} onChangeText={name => setCurrentItem({...currentItem, name})} style={styles.input}/>
            </View>
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Tipo de Finca</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={currentItem.type} onValueChange={type => setCurrentItem({...currentItem, type: type as FarmType})} style={styles.picker}>
                        {farmTypes.map(ft => <Picker.Item key={ft.value} label={ft.label} value={ft.value} />)}
                    </Picker>
                </View>
            </View>
             <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Ubicación</Text>
                <TextInput value={currentItem.location} onChangeText={location => setCurrentItem({...currentItem, location})} style={styles.input}/>
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

export default FarmEditScreen;