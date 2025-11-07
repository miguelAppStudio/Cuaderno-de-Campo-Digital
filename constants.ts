
import React from 'react';
import { Holiday, View } from './types';
import { HomeIcon, NoteIcon, CalendarIcon, FarmIcon, LivestockIcon, SyringeIcon, DropletIcon } from './components/icons';

export const NAV_ITEMS: { view: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { view: 'HOME', label: 'Inicio', icon: HomeIcon },
  { view: 'NOTES', label: 'Notas', icon: NoteIcon },
  { view: 'CALENDAR', label: 'Calendario', icon: CalendarIcon },
  { view: 'FARMS', label: 'Fincas', icon: FarmIcon },
  { view: 'LIVESTOCK', label: 'Ganado', icon: LivestockIcon },
];

export const SPANISH_HOLIDAYS_2024: Holiday[] = [
  { date: '2024-01-01', name: 'Año Nuevo' },
  { date: '2024-01-06', name: 'Epifanía del Señor' },
  { date: '2024-03-29', name: 'Viernes Santo' },
  { date: '2024-05-01', name: 'Fiesta del Trabajo' },
  { date: '2024-08-15', name: 'Asunción de la Virgen' },
  { date: '2024-10-12', name: 'Fiesta Nacional de España' },
  { date: '2024-11-01', name: 'Todos los Santos' },
  { date: '2024-12-06', name: 'Día de la Constitución' },
  { date: '2024-12-25', name: 'Navidad del Señor' },
];

export const HOME_CARDS = [
    { view: 'NOTES' as View, title: 'Tomar Notas', description: 'Apunta todo lo importante y adjunta fotos.', imageUrl: 'https://picsum.photos/seed/notes/600/400', icon: NoteIcon },
    { view: 'CALENDAR' as View, title: 'Calendario Agrícola', description: 'Planifica tu año con festivos nacionales.', imageUrl: 'https://picsum.photos/seed/calendar/600/400', icon: CalendarIcon },
    { view: 'FARMS' as View, title: 'Gestionar Fincas', description: 'Controla tus olivares, pinares y más.', imageUrl: 'https://picsum.photos/seed/farms/600/400', icon: FarmIcon },
    { view: 'FARM_PRODUCTS' as View, title: 'Productos Fitosanitarios', description: 'Registro de tratamientos para tus cultivos.', imageUrl: 'https://picsum.photos/seed/products/600/400', icon: DropletIcon },
    { view: 'LIVESTOCK' as View, title: 'Gestionar Ganado', description: 'Administra tus rebaños de cabras y ovejas.', imageUrl: 'https://picsum.photos/seed/livestock/600/400', icon: LivestockIcon },
    { view: 'LIVESTOCK_CARE' as View, title: 'Cuidado Animal', description: 'Lleva un control de vacunas y cuidados.', imageUrl: 'https://picsum.photos/seed/care/600/400', icon: SyringeIcon }
];