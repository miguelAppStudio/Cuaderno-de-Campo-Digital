
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Fix: Add imports for typed navigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAsyncStorage from '../hooks/useAsyncStorage';
// Fix: Import param list for typed navigation
import { Note, NotesStackParamList } from '../types';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons';

const NotesScreen: React.FC = () => {
  // Fix: Type the navigation prop to enable type-safe navigation.
  const navigation = useNavigation<NativeStackNavigationProp<NotesStackParamList>>();
  const [notes, setNotes, loading] = useAsyncStorage<Note[]>('notes', []);
  
  const sortedNotes = notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => setNotes(notes.filter(n => n.id !== id)) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View className="bg-surface p-4 rounded-lg shadow-md mb-4">
      {item.photo && (
        <Image source={{ uri: item.photo }} className="w-full h-48 rounded-md mb-3" resizeMode="cover" />
      )}
      <Text className="text-text-primary text-base whitespace-pre-wrap">{item.text}</Text>
      <Text className="text-xs text-text-secondary mt-2">{new Date(item.createdAt).toLocaleString('es-ES')}</Text>
      <View className="flex-row justify-end gap-2 mt-3 border-t border-border pt-3">
        {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
        <TouchableOpacity onPress={() => navigation.navigate('NoteEdit', { noteId: item.id })} className="p-2 active:bg-blue-100 rounded-full">
          <EditIcon color="#3b82f6" width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2 active:bg-red-100 rounded-full">
          <TrashIcon color="#ef4444" width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-3xl font-bold text-primary mb-6">Mis Notas</Text>
        {loading ? (
          <Text>Cargando notas...</Text>
        ) : (
          <FlatList
            data={sortedNotes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text className="text-center text-text-secondary mt-8">No tienes notas todavía. ¡Añade una!</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
      {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
      <TouchableOpacity
        onPress={() => navigation.navigate('NoteEdit', {})}
        className="absolute bottom-5 right-5 bg-primary p-4 rounded-full shadow-lg active:bg-primary-dark"
      >
        <PlusIcon color="white" width={32} height={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotesScreen;