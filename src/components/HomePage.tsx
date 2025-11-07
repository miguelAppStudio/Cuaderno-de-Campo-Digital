import React from 'react';
import { View } from '../types';
import { HOME_CARDS } from '../constants';

interface HomePageProps {
  setView: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="p-4 pb-20">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary">Cuaderno de Campo</h1>
        <p className="text-text-secondary mt-2">Tu asistente digital para la agricultura y ganadería.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOME_CARDS.map(card => (
          <div
            key={card.view}
            className="bg-surface rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
            onClick={() => setView(card.view)}
          >
            <div className="relative h-40">
              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
              <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full">
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-text-primary">{card.title}</h2>
              <p className="text-text-secondary mt-1 text-sm">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
