
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { Note, NoteEditScreenProps } from '../types';
import { BackIcon, SaveIcon, CameraIcon } from '../components/icons';

const NoteEditScreen: React.FC<NoteEditScreenProps> = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [notes, setNotes] = useAsyncStorage<Note[]>('notes', []);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({ text: '', photo: undefined });
  const isEditing = !!noteId;

  useEffect(() => {
    if (isEditing) {
      const noteToEdit = notes.find(n => n.id === noteId);
      if (noteToEdit) {
        setCurrentNote(noteToEdit);
      }
    }
  }, [noteId, notes, isEditing]);

  const handleSave = () => {
    if (!currentNote.text?.trim()) {
        Alert.alert("Campo vacío", "Por favor, escribe algo en la nota antes de guardar.");
        return;
    }

    if (isEditing) {
      setNotes(notes.map(n => (n.id === noteId ? (currentNote as Note) : n)));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        text: currentNote.text || '',
        createdAt: new Date().toISOString(),
        photo: currentNote.photo,
      };
      setNotes([...notes, newNote]);
    }
    navigation.goBack();
  };

  const handlePhotoCapture = () => {
    Alert.alert("Añadir foto", "Elige una opción", [
        {
            text: "Tomar Foto",
            onPress: () => launchCamera({ mediaType: 'photo', quality: 0.7, saveToPhotos: true }, response => {
                if (response.didCancel) return;
                if (response.assets && response.assets[0].uri) {
                    setCurrentNote({ ...currentNote, photo: response.assets[0].uri });
                }
            })
        },
        {
            text: "Elegir de la Galería",
            onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 0.7}, response => {
                if (response.didCancel) return;
                if (response.assets && response.assets[0].uri) {
                    setCurrentNote({ ...currentNote, photo: response.assets[0].uri });
                }
            })
        },
        { text: "Cancelar", style: "cancel" }
    ])
  }


  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 border-b border-border bg-surface">
        {/* Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error. */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full active:bg-gray-200">
          <BackIcon color="#1e293b" width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-primary">{isEditing ? 'Editar Nota' : 'Nueva Nota'}</Text>
        <TouchableOpacity onPress={handleSave} className="p-2 rounded-full bg-primary active:bg-primary-dark">
          <SaveIcon color="white" width={24} height={24} />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <TextInput
          className="w-full h-48 p-4 border border-border rounded-lg text-base text-text-primary bg-surface"
          value={currentNote.text}
          onChangeText={(text) => setCurrentNote({ ...currentNote, text })}
          placeholder="Escribe tu nota aquí..."
          multiline
          textAlignVertical="top"
        />
        <View className="mt-4">
          <TouchableOpacity
            onPress={handlePhotoCapture}
            className="w-full flex-row items-center justify-center gap-2 p-3 bg-secondary rounded-lg active:bg-orange-600"
          >
            <CameraIcon color="white" width={24} height={24} />
            <Text className="text-white font-semibold text-base">{currentNote.photo ? 'Cambiar Foto' : 'Añadir Foto'}</Text>
          </TouchableOpacity>
          {currentNote.photo && (
            <View className="mt-4 items-center">
              <Image source={{ uri: currentNote.photo }} className="rounded-lg h-60 w-full" resizeMode="contain" />
              <TouchableOpacity onPress={() => setCurrentNote({ ...currentNote, photo: undefined })} className="mt-2">
                <Text className="text-red-500 hover:underline">Eliminar foto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NoteEditScreen;