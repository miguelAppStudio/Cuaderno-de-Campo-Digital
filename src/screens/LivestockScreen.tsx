
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Fix: Add imports for typed navigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAsyncStorage from '../hooks/useAsyncStorage';
// Fix: Import param list for typed navigation
import { Animal, LivestockStackParamList } from '../types';
import { PlusIcon, EditIcon, TrashIcon, AiIcon, SyringeIcon } from '../components/icons';
import { getAiSuggestions } from '../services/geminiService';
import AiSuggestionModal from '../components/AiSuggestionModal';

const LivestockScreen: React.FC = () => {
  // Fix: Type the navigation prop to enable type-safe navigation.
  const navigation = useNavigation<NativeStackNavigationProp<LivestockStackParamList>>();
  const [livestock, setLivestock, loading] = useAsyncStorage<Animal[]>('livestock', []);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestedAnimal, setSuggestedAnimal] = useState<Animal | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar Animal', '¿Estás seguro de que quieres eliminar este animal?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setLivestock(livestock.filter(a => a.id !== id)) },
    ]);
  };

  const handleGetSuggestion = async (animal: Animal) => {
    setSuggestedAnimal(animal);
    setIsLoadingSuggestion(true);
    const prompt = `Proporciona sugerencias de cuidado para una ${animal.type} con crotal ${animal.tag}, nacida el ${animal.birthDate}. Notas adicionales: "${animal.notes}".`;
    const result = await getAiSuggestions(prompt);
    setSuggestion(result);
    setIsLoadingSuggestion(false);
  };

  const renderItem = ({ item }: { item: Animal }) => (
    <View className="bg-surface p-4 rounded-lg shadow-md mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-bold text-lg text-text-primary">Crotal: {item.tag}</Text>
          <Text className="text-sm text-text-secondary capitalize">{item.type} - Nac.: {new Date(item.birthDate).toLocaleDateString('es-ES')}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
          <TouchableOpacity onPress={() => navigation.navigate('LivestockEdit', { animalId: item.id })} className="p-2 active:bg-blue-100 rounded-full">
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
         <TouchableOpacity onPress={() => navigation.navigate('LivestockCare', { animalId: item.id, animalTag: item.tag })} className="text-sm text-secondary font-semibold active:underline flex-row items-center gap-1 p-1">
            <SyringeIcon color="#f97316" width={16} height={16} />
            <Text className="text-secondary font-semibold">Cuidados</Text>
         </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-3xl font-bold text-primary mb-6">Gestión de Ganado</Text>
        {loading ? (
          <Text>Cargando ganado...</Text>
        ) : (
          <FlatList
            data={livestock}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text className="text-center text-text-secondary mt-8">No tienes animales registrados. ¡Añade uno!</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
       {suggestedAnimal && (
        <AiSuggestionModal
          visible={!!suggestedAnimal}
          title={`Sugerencias para ${suggestedAnimal.tag}`}
          suggestion={suggestion}
          isLoading={isLoadingSuggestion}
          onClose={() => setSuggestedAnimal(null)}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('LivestockEdit', {})}
        className="absolute bottom-5 right-5 bg-primary p-4 rounded-full shadow-lg active:bg-primary-dark"
      >
        <PlusIcon color="white" width={32} height={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LivestockScreen;