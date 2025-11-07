
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Fix: Add imports for typed navigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAsyncStorage from '../hooks/useAsyncStorage';
// Fix: Import param list for typed navigation
import { Farm, FarmsStackParamList } from '../types';
import { PlusIcon, EditIcon, TrashIcon, AiIcon, DropletIcon } from '../components/icons';
import { getAiSuggestions } from '../services/geminiService';
import AiSuggestionModal from '../components/AiSuggestionModal';

const FarmsScreen: React.FC = () => {
  // Fix: Type the navigation prop to enable type-safe navigation.
  const navigation = useNavigation<NativeStackNavigationProp<FarmsStackParamList>>();
  const [farms, setFarms, loading] = useAsyncStorage<Farm[]>('farms', []);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestedFarm, setSuggestedFarm] = useState<Farm | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar Finca', '¿Estás seguro de que quieres eliminar esta finca?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setFarms(farms.filter(f => f.id !== id)) },
    ]);
  };

  const handleGetSuggestion = async (farm: Farm) => {
    setSuggestedFarm(farm);
    setIsLoadingSuggestion(true);
    const prompt = `Proporciona sugerencias de cuidado para una finca de tipo '${farm.type}' llamada '${farm.name}', ubicada en '${farm.location}'. Notas adicionales: "${farm.notes}".`;
    const result = await getAiSuggestions(prompt);
    setSuggestion(result);
    setIsLoadingSuggestion(false);
  };

  const renderItem = ({ item }: { item: Farm }) => (
    <View className="bg-surface p-4 rounded-lg shadow-md mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-bold text-lg text-text-primary">{item.name}</Text>
          <Text className="text-sm text-text-secondary capitalize">{item.type} - {item.location}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
          <TouchableOpacity onPress={() => navigation.navigate('FarmEdit', { farmId: item.id })} className="p-2 active:bg-blue-100 rounded-full">
            <EditIcon color="#3b82f6" width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2 active:bg-red-100 rounded-full">
            <TrashIcon color="#ef4444" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-text-primary mt-2 whitespace-pre-wrap">{item.notes}</Text>
      <View className="mt-3 border-t border-border pt-2 flex-row justify-between">
         <TouchableOpacity onPress={() => handleGetSuggestion(item)} className="text-sm text-primary font-semibold active:underline flex-row items-center gap-1 p-1">
            <AiIcon color="#22c55e" width={16} height={16} />
            <Text className="text-primary font-semibold">Sugerencias IA</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('FarmProducts', { farmId: item.id, farmName: item.name })} className="text-sm text-secondary font-semibold active:underline flex-row items-center gap-1 p-1">
            <DropletIcon color="#f97316" width={16} height={16} />
            <Text className="text-secondary font-semibold">Productos</Text>
         </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-3xl font-bold text-primary mb-6">Gestión de Fincas</Text>
        {loading ? (
          <Text>Cargando fincas...</Text>
        ) : (
          <FlatList
            data={farms}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text className="text-center text-text-secondary mt-8">No tienes fincas todavía. ¡Añade una!</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
      {suggestedFarm && (
        <AiSuggestionModal
          visible={!!suggestedFarm}
          title={`Sugerencias para ${suggestedFarm.name}`}
          suggestion={suggestion}
          isLoading={isLoadingSuggestion}
          onClose={() => setSuggestedFarm(null)}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('FarmEdit', {})}
        className="absolute bottom-5 right-5 bg-primary p-4 rounded-full shadow-lg active:bg-primary-dark"
      >
        <PlusIcon color="white" width={32} height={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FarmsScreen;