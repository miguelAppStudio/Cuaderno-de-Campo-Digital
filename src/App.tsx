import React, { useState } from 'react';
import { View } from './types';
import BottomNavBar from './components/BottomNavBar';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import CalendarPage from './components/CalendarPage';
import FarmsPage from './components/FarmsPage';
import FarmProductsPage from './components/FarmProductsPage';
import LivestockPage from './components/LivestockPage';
import LivestockCarePage from './components/LivestockCarePage';
import useLocalStorage from './hooks/useLocalStorage';

const WelcomeModal: React.FC<{onClose: () => void}> = ({onClose}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-primary mb-3">¡Bienvenido al Cuaderno de Campo Digital!</h2>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Análisis de la Solución Técnica</h3>
                <p className="text-text-secondary mb-4 text-sm">
                    Para desarrollar esta aplicación, he optado por las tecnologías más modernas y eficientes del ecosistema de desarrollo web frontal, respondiendo a tu familiaridad con React.
                </p>
                <ul className="space-y-2 text-sm list-disc list-inside text-text-primary">
                    <li><strong>React con TypeScript:</strong> Proporciona una base sólida, escalable y con seguridad de tipos para construir una interfaz de usuario compleja y mantenible.</li>
                    <li><strong>Tailwind CSS:</strong> Permite un diseño rápido, moderno y totalmente personalizado sin salir del código, garantizando una estética excelente y una experiencia de usuario (UI/UX) de primer nivel.</li>
                    <li><strong>Persistencia de Datos con `localStorage`:</strong> Para esta demostración, todos los datos que introduzcas (notas, fincas, animales, etc.) se guardarán localmente en tu navegador. Esto crea una experiencia de usuario completa y funcional para un solo usuario sin necesidad de un backend.</li>
                </ul>
                <p className="text-text-secondary mt-4 text-sm">
                    <strong>Próximos Pasos:</strong> Para una aplicación real con múltiples usuarios, el siguiente paso sería conectar esta interfaz de React con un backend (como el <strong>PHP</strong> que mencionaste) y una base de datos (MySQL, PostgreSQL). Esto permitiría el almacenamiento centralizado de los datos y la gestión de cuentas de usuario.
                </p>
                <button onClick={onClose} className="mt-6 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                    Empezar a Usar la App
                </button>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');
  const [showWelcome, setShowWelcome] = useLocalStorage('showWelcome', true);

  const renderView = () => {
    switch (view) {
      case 'HOME':
        return <HomePage setView={setView} />;
      case 'NOTES':
        return <NotesPage />;
      case 'CALENDAR':
        return <CalendarPage />;
      case 'FARMS':
        return <FarmsPage />;
      case 'FARM_PRODUCTS':
          return <FarmProductsPage />;
      case 'LIVESTOCK':
          return <LivestockPage />;
      case 'LIVESTOCK_CARE':
          return <LivestockCarePage />;
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-text-primary">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)}/>}
      <main className="h-full">
        {renderView()}
      </main>
      <BottomNavBar currentView={view} setView={setView} />
    </div>
  );
};

export default App;
