
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { FarmProduct, FarmProductEditScreenProps } from '../types';
import { BackIcon, SaveIcon } from '../components/icons';

const FarmProductEditScreen: React.FC<FarmProductEditScreenProps> = ({ route, navigation }) => {
  const { farmId, productId } = route.params;
  const [products, setProducts] = useAsyncStorage<FarmProduct[]>('farm_products', []);
  const [currentItem, setCurrentItem] = useState<Partial<FarmProduct>>({ 
      name: '', 
      description: '', 
      applicationDate: new Date().toISOString().split('T')[0],
      farmId,
  });
  const isEditing = !!productId;

  useEffect(() => {
    if (isEditing) {
      const itemToEdit = products.find(p => p.id === productId);
      if (itemToEdit) setCurrentItem(itemToEdit);
    }
  }, [productId, products, isEditing]);

  const handleSave = () => {
    if (!currentItem.name?.trim() || !currentItem.applicationDate) {
      Alert.alert("Campos requeridos", "El nombre del producto y la fecha son obligatorios.");
      return;
    }

    if (isEditing) {
      setProducts(products.map(p => (p.id === productId ? (currentItem as FarmProduct) : p)));
    } else {
      const newItem: FarmProduct = {
        id: Date.now().toString(),
        name: currentItem.name || '',
        description: currentItem.description || '',
        applicationDate: currentItem.applicationDate || '',
        farmId: farmId,
      };
      setProducts([...products, newItem]);
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
        <Text className="text-2xl font-bold text-primary">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Text>
        <TouchableOpacity onPress={handleSave} className="p-2 rounded-full bg-primary active:bg-primary-dark">
          <SaveIcon color="white" width={24} height={24} />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="space-y-4">
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Nombre del Producto</Text>
                <TextInput value={currentItem.name} onChangeText={name => setCurrentItem({...currentItem, name})} style={styles.input}/>
            </View>
             <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Fecha de Aplicación</Text>
                {/* Fix: Corrected property from 'date' to 'applicationDate' */}
                <TextInput value={currentItem.applicationDate} onChangeText={date => setCurrentItem({...currentItem, applicationDate: date})} placeholder="YYYY-MM-DD" style={styles.input}/>
            </View>
            <View>
                <Text className="text-sm font-medium text-text-secondary mb-1">Descripción / Dosis</Text>
                <TextInput value={currentItem.description} onChangeText={description => setCurrentItem({...currentItem, description})} multiline textAlignVertical="top" style={[styles.input, {height: 100}]}/>
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
});

export default FarmProductEditScreen;