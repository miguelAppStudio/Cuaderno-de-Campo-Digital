
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
