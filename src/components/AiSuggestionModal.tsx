
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AiIcon, CloseIcon } from './icons';

interface AiSuggestionModalProps {
  visible: boolean;
  title: string;
  suggestion: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const AiSuggestionModal: React.FC<AiSuggestionModalProps> = ({ visible, title, suggestion, isLoading, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="bg-surface rounded-lg shadow-xl p-6 w-full max-h-[80%]">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2 flex-1">
                <AiIcon color="#22c55e" width={24} height={24} />
                <Text className="text-xl font-bold text-primary" numberOfLines={1}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full">
              <CloseIcon color="#64748b" width={24} height={24} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {isLoading ? (
                <View className="flex-1 justify-center items-center p-8">
                    <ActivityIndicator size="large" color="#22c55e" />
                    <Text className="mt-4 text-text-secondary">Generando sugerencias con IA...</Text>
                </View>
            ) : (
                <Text className="text-text-primary">
                    {suggestion}
                </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AiSuggestionModal;
