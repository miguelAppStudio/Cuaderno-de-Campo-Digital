
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { Animal, LivestockEditScreenProps, AnimalType } from '../types';
import { BackIcon, SaveIcon } from '../components/icons';

const LivestockEditScreen: React.FC<LivestockEditScreenProps> = ({ route, navigation }) => {
  const { animalId } = route.params;
  const [livestock, setLivestock] = useAsyncStorage<Animal[]>('livestock', []);
  const [currentItem, setCurrentItem] = useState<Partial<Animal>>({ 
      tag: '', 
      type: 'oveja', 
      birthDate: new Date().toISOString().split('T')[0], 
      notes: '' 
  });
  const isEditing = !!animalId;

  const animalTypes: { value: AnimalType; label: string }[] = [
    { value: 'cabra', label: 'Cabra' },
    { value: 'oveja', label: 'Oveja' },
  ];

  useEffect(() => {
    if (isEditing) {
      const itemToEdit = livestock.find(a => a.id === animalId);
      if (itemToEdit) setCurrentItem(itemToEdit);
    }
  }, [animalId, livestock, isEditing]);

  const handleSave = () => {
    if (!currentItem.tag?.trim() || !currentItem.birthDate) {
      Alert.alert("Campos requeridos", "El número de crotal y la fecha de nacimiento son obligatorios.");
      return;
    }

    if (isEditing) {
      setLivestock(livestock.map(a => (a.id === animalId ? (currentItem as Animal) : a)));
    } else {
      const newItem: Animal = {
        id: Date.now().toString(),
        tag: currentItem.tag || '',
        type: currentItem.type || 'oveja',
        birthDate: currentItem.birthDate || '',
        notes: currentItem.notes || '',
      };
      setLivestock([...livestock, newItem]);
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
        <Text className="text-2xl font-bold text-primary">{isEditing ? 'Editar Animal' : 'Nuevo Animal'}</Text>
        <TouchableOpacity onPress={handleSave} className="p-2 rounded-full bg-primary active:bg-primary-dark">
          <SaveIcon color="white" width={24} height={24} />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="space-y-4">
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Nº de Crotal / Identificador</Text>
                <TextInput value={currentItem.tag} onChangeText={tag => setCurrentItem({...currentItem, tag})} style={styles.input}/>
            </View>
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Tipo de Animal</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={currentItem.type} onValueChange={type => setCurrentItem({...currentItem, type: type as AnimalType})} style={styles.picker}>
                        {animalTypes.map(at => <Picker.Item key={at.value} label={at.label} value={at.value} />)}
                    </Picker>
                </View>
            </View>
             <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Fecha de Nacimiento</Text>
                <TextInput value={currentItem.birthDate} onChangeText={birthDate => setCurrentItem({...currentItem, birthDate})} placeholder="YYYY-MM-DD" style={styles.input}/>
            </View>
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Notas (vacunas, partos, etc.)</Text>
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

export default LivestockEditScreen;