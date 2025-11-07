
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { LivestockCare, LivestockCareScreenProps } from '../types';
import { PlusIcon, EditIcon, TrashIcon, BackIcon } from '../components/icons';

const LivestockCareScreen: React.FC<LivestockCareScreenProps> = ({ route, navigation }) => {
  const { animalId, animalTag } = route.params;
  const [care, setCare, loading] = useAsyncStorage<LivestockCare[]>('livestock_care', []);
  
  const animalCare = care.filter(c => c.animalId === animalId);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar Cuidado', '¿Estás seguro de que quieres eliminar este registro de cuidado?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setCare(care.filter(c => c.id !== id)) },
    ]);
  };

  const renderItem = ({ item }: { item: LivestockCare }) => (
    <View className="bg-surface p-4 rounded-lg shadow-md mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-bold text-lg text-text-primary capitalize">{item.type}: {item.product}</Text>
          <Text className="text-sm text-text-secondary">Fecha: {new Date(item.date).toLocaleDateString('es-ES')}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
          <TouchableOpacity onPress={() => navigation.navigate('LivestockCareEdit', { animalId, careId: item.id })} className="p-2 active:bg-blue-100 rounded-full">
            <EditIcon color="#3b82f6" width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2 active:bg-red-100 rounded-full">
            <TrashIcon color="#ef4444" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-text-primary mt-2 whitespace-pre-wrap">{item.notes}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
       <View className="flex-row items-center p-4 border-b border-border bg-surface">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full active:bg-gray-200">
          <BackIcon color="#1e293b" width={24} height={24} />
        </TouchableOpacity>
        <View className="flex-1 ml-4">
            <Text className="text-2xl font-bold text-primary" numberOfLines={1}>Cuidados de {animalTag}</Text>
        </View>
      </View>
      <View className="p-4 flex-1">
        {loading ? (
          <Text>Cargando cuidados...</Text>
        ) : (
          <FlatList
            data={animalCare}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text className="text-center text-text-secondary mt-8">No tienes cuidados para este animal. ¡Añade uno!</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('LivestockCareEdit', { animalId })}
        className="absolute bottom-5 right-5 bg-primary p-4 rounded-full shadow-lg active:bg-primary-dark"
      >
        <PlusIcon color="white" width={32} height={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LivestockCareScreen;