import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Fix: Add necessary imports for typed navigation
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HOME_CARDS } from '../constants';
// Fix: Import RootTabParamList for typed navigation
import { RootTabParamList } from '../types';

const HomeScreen = () => {
  // Fix: Type the navigation prop to enable type-safe navigation.
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4 items-center mb-6">
          <Text className="text-4xl font-bold text-primary">Cuaderno de Campo</Text>
          <Text className="text-base text-text-secondary mt-2">Tu asistente digital para el campo.</Text>
        </View>
        <View className="px-4">
          {HOME_CARDS.map(card => (
            // Fix: Replaced StyledTouchableOpacity with TouchableOpacity to resolve 'styled' import error.
            <TouchableOpacity
              // Fix: Use 'card.title' for a unique key as 'card.route' can be duplicated.
              key={card.title}
              className="bg-surface rounded-lg shadow-lg overflow-hidden mb-6 active:opacity-80"
              // Fix: Removed 'as any' cast due to typed navigation.
              onPress={() => navigation.navigate(card.route as keyof RootTabParamList)}
            >
              <ImageBackground
                source={{ uri: card.imageUrl }}
                className="h-40 justify-end"
                resizeMode="cover"
              >
                <View className="absolute inset-0 bg-black/40" />
                <View className="absolute top-4 right-4 bg-primary p-2 rounded-full">
                  <card.icon color="white" width={24} height={24} />
                </View>
              </ImageBackground>
              <View className="p-4">
                <Text className="text-xl font-bold text-text-primary">{card.title}</Text>
                <Text className="text-sm text-text-secondary mt-1">{card.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
