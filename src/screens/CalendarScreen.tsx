
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPANISH_HOLIDAYS_2024 } from '../constants';
import { Holiday } from '../types';

const CalendarScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const holidaysMap = new Map<string, string>(
    SPANISH_HOLIDAYS_2024.map((h: Holiday) => [h.date, h.name])
  );

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const days = Array(startDay).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days.map((day, index) => {
        if (!day) return <View key={`empty-${index}`} className="flex-1 p-2 items-center" />;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isHoliday = holidaysMap.has(dateStr);

        const dayContainerClass = isToday ? "bg-primary" : isHoliday ? "bg-secondary" : "";
        const dayTextClass = isToday || isHoliday ? "text-white font-bold" : "text-text-primary";

        return (
            <View key={day} className="flex-1 p-1 items-center">
                <View className={`w-10 h-10 items-center justify-center rounded-full ${dayContainerClass}`}>
                    <Text className={`text-sm ${dayTextClass}`}>{day}</Text>
                </View>
            </View>
        );
    });
  };

  const renderWeeks = () => {
      const days = renderCalendar();
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
          weeks.push(
              <View key={`week-${i/7}`} className="flex-row justify-around mb-2">
                  {days.slice(i, i+7)}
              </View>
          );
      }
      return weeks;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-3xl font-bold text-primary mb-6 text-center">Calendario</Text>
        <View className="bg-surface p-4 rounded-lg shadow-md w-full mx-auto">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2 rounded-full active:bg-gray-200">
              <Text className="text-xl font-bold text-text-primary">&lt;</Text>
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-text-primary">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)} className="p-2 rounded-full active:bg-gray-200">
              <Text className="text-xl font-bold text-text-primary">&gt;</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-around mb-2">
            {weekDays.map(day => <Text key={day} className="w-10 text-center font-medium text-text-secondary">{day}</Text>)}
          </View>
          {renderWeeks()}
          <View className="mt-6 border-t border-border pt-4">
            <Text className="font-bold text-lg mb-2 text-text-primary">Leyenda</Text>
            <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-2">
                    <View className="w-5 h-5 rounded-full bg-primary" />
                    <Text>Hoy</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <View className="w-5 h-5 rounded-full bg-secondary" />
                    <Text>Festivo</Text>
                </View>
            </View>
        </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
