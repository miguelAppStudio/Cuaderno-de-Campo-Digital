
import React, { useState } from 'react';
import { SPANISH_HOLIDAYS_2024 } from '../constants';
import { Holiday } from '../types';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const holidaysMap = new Map<string, string>(
    SPANISH_HOLIDAYS_2024.map((h: Holiday) => [h.date, h.name])
  );

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

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
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Adjust firstDay to be Monday-first (0=Monday, ..., 6=Sunday)
    const startDay = (firstDay === 0) ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isHoliday = holidaysMap.has(dateStr);

      let dayClasses = "w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors";
      if (isToday) {
        dayClasses += " bg-primary text-white font-bold";
      } else if (isHoliday) {
        dayClasses += " bg-secondary text-white";
      } else {
        dayClasses += " text-text-primary hover:bg-gray-200";
      }

      days.push(
        <div key={day} className="flex flex-col items-center p-1" title={isHoliday ? holidaysMap.get(dateStr) : ''}>
          <div className={dayClasses}>
            {day}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Calendario</h1>
      <div className="bg-surface p-4 rounded-lg shadow-md max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200">&lt;</button>
          <h2 className="text-xl font-semibold text-text-primary">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-medium text-text-secondary text-xs">
          <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {renderCalendar()}
        </div>
        <div className="mt-6 border-t pt-4">
            <h3 className="font-bold text-lg mb-2 text-text-primary">Leyenda</h3>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary"></div>
                    <span>Hoy</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-secondary"></div>
                    <span>Festivo</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
