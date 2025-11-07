
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type View = 'HOME' | 'NOTES' | 'CALENDAR' | 'FARMS' | 'FARM_PRODUCTS' | 'LIVESTOCK' | 'LIVESTOCK_CARE';

export interface Note {
  id: string;
  text: string;
  photo?: string; // base64 string
  createdAt: string;
}

export type FarmType = 'olivar' | 'pinar' | 'frutales' | 'otro';

export interface Farm {
  id: string;
  name: string;
  type: FarmType;
  location: string;
  notes: string;
}

export interface FarmProduct {
  id: string;
  name: string;
  description: string;
  applicationDate: string;
  farmId: string;
}

export type AnimalType = 'cabra' | 'oveja';

export interface Animal {
  id: string;
  tag: string;
  type: AnimalType;
  birthDate: string;
  notes: string;
}

export interface LivestockCare {
  id: string;
  animalId: string;
  type: 'vacuna' | 'tratamiento' | 'alimentacion' | 'otro';
  product: string;
  date: string;
  notes: string;
}

export type Holiday = {
    date: string; // YYYY-MM-DD
    name: string;
}

// Fix: Add navigation types for React Native app
export type RootTabParamList = {
  Inicio: undefined;
  Notas: undefined;
  Calendario: undefined;
  Fincas: undefined;
  Ganado: undefined;
};

export type NotesStackParamList = {
  NotesList: undefined;
  NoteEdit: { noteId?: string };
};
export type NoteEditScreenProps = NativeStackScreenProps<NotesStackParamList, 'NoteEdit'>;

export type FarmsStackParamList = {
  FarmsList: undefined;
  FarmEdit: { farmId?: string };
  FarmProducts: { farmId: string; farmName: string };
  FarmProductEdit: { farmId: string; productId?: string };
};
export type FarmEditScreenProps = NativeStackScreenProps<FarmsStackParamList, 'FarmEdit'>;
export type FarmProductsScreenProps = NativeStackScreenProps<FarmsStackParamList, 'FarmProducts'>;
export type FarmProductEditScreenProps = NativeStackScreenProps<FarmsStackParamList, 'FarmProductEdit'>;

export type LivestockStackParamList = {
  LivestockList: undefined;
  LivestockEdit: { animalId?: string };
  LivestockCare: { animalId: string; animalTag: string };
  LivestockCareEdit: { animalId: string; careId?: string };
};
export type LivestockEditScreenProps = NativeStackScreenProps<LivestockStackParamList, 'LivestockEdit'>;
export type LivestockCareScreenProps = NativeStackScreenProps<LivestockStackParamList, 'LivestockCare'>;
export type LivestockCareEditScreenProps = NativeStackScreenProps<LivestockStackParamList, 'LivestockCareEdit'>;
