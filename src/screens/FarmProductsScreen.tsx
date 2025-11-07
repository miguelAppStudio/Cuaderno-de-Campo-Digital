
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { FarmProduct, FarmProductsScreenProps } from '../types';
import { PlusIcon, EditIcon, TrashIcon, BackIcon } from '../components/icons';

const FarmProductsScreen: React.FC<FarmProductsScreenProps> = ({ route, navigation }) => {
  const { farmId, farmName } = route.params;
  const [products, setProducts, loading] = useAsyncStorage<FarmProduct[]>('farm_products', []);
  
  const farmProducts = products.filter(p => p.farmId === farmId);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar Producto', '¿Estás seguro de que quieres eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setProducts(products.filter(p => p.id !== id)) },
    ]);
  };

  const renderItem = ({ item }: { item: FarmProduct }) => (
    <View className="bg-surface p-4 rounded-lg shadow-md mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-bold text-lg text-text-primary">{item.name}</Text>
          <Text className="text-sm text-text-secondary">Fecha: {new Date(item.applicationDate).toLocaleDateString('es-ES')}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
          <TouchableOpacity onPress={() => navigation.navigate('FarmProductEdit', { farmId, productId: item.id })} className="p-2 active:bg-blue-100 rounded-full">
            <EditIcon color="#3b82f6" width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2 active:bg-red-100 rounded-full">
            <TrashIcon color="#ef4444" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-text-primary mt-2 whitespace-pre-wrap">{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
       <View className="flex-row items-center p-4 border-b border-border bg-surface">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full active:bg-gray-200">
          <BackIcon color="#1e293b" width={24} height={24} />
        </TouchableOpacity>
        <View className="flex-1 ml-4">
            <Text className="text-2xl font-bold text-primary" numberOfLines={1}>Productos de {farmName}</Text>
        </View>
      </View>
      <View className="p-4 flex-1">
        {loading ? (
          <Text>Cargando productos...</Text>
        ) : (
          <FlatList
            data={farmProducts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text className="text-center text-text-secondary mt-8">No tienes productos para esta finca. ¡Añade uno!</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('FarmProductEdit', { farmId })}
        className="absolute bottom-5 right-5 bg-primary p-4 rounded-full shadow-lg active:bg-primary-dark"
      >
        <PlusIcon color="white" width={32} height={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FarmProductsScreen;