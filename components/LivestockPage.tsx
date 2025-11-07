
import React, { useState } from 'react';
import { Animal, AnimalType } from '../types';
import CrudTemplate from './CrudTemplate';
import { EditIcon, TrashIcon, AiIcon, CloseIcon } from './icons';
import { getAiSuggestions } from '../services/geminiService';

const AnimalItem: React.FC<{item: Animal, onEdit: (item: Animal) => void, onDelete: (id: string) => void, onGetSuggestion: (animal: Animal) => void}> = ({ item, onEdit, onDelete, onGetSuggestion }) => (
    <>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-text-primary">crotal: {item.tag}</h3>
                <p className="text-sm text-text-secondary capitalize">{item.type} - Nacimiento: {new Date(item.birthDate).toLocaleDateString('es-ES')}</p>
            </div>
             <div className="flex items-center gap-2">
                <button onClick={() => onEdit(item)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><EditIcon className="w-5 h-5"/></button>
                <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
            </div>
        </div>
        <p className="text-text-primary mt-2 whitespace-pre-wrap">{item.notes}</p>
        <div className="mt-3 border-t pt-2">
             <button onClick={() => onGetSuggestion(item)} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                <AiIcon className="w-4 h-4" />
                Obtener Sugerencias de Cuidado
             </button>
        </div>
    </>
);

const AnimalForm: React.FC<{currentItem: Animal, setCurrentItem: React.Dispatch<React.SetStateAction<Animal>>}> = ({ currentItem, setCurrentItem }) => {
    const animalTypes: {value: AnimalType, label: string}[] = [
        {value: 'cabra', label: 'Cabra'},
        {value: 'oveja', label: 'Oveja'},
    ]
    return (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-text-secondary">Nº de Crotal / Identificador</label>
            <input type="text" value={currentItem.tag} onChange={e => setCurrentItem({...currentItem, tag: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Tipo de Animal</label>
            <select value={currentItem.type} onChange={e => setCurrentItem({...currentItem, type: e.target.value as AnimalType})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                {animalTypes.map(at => <option key={at.value} value={at.value}>{at.label}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Fecha de Nacimiento</label>
            <input type="date" value={currentItem.birthDate} onChange={e => setCurrentItem({...currentItem, birthDate: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Notas (vacunas, partos, etc.)</label>
            <textarea value={currentItem.notes} onChange={e => setCurrentItem({...currentItem, notes: e.target.value})} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
        </div>
    </div>
)};

const AiSuggestionModal: React.FC<{suggestion: string, animalTag: string, onClose: () => void, isLoading: boolean}> = ({ suggestion, animalTag, onClose, isLoading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-primary flex items-center gap-2"><AiIcon className="w-6 h-6" /> Sugerencias para {animalTag}</h3>
                 <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon className="w-5 h-5"/></button>
            </div>
            <div className="flex-grow overflow-y-auto prose prose-sm max-w-none">
                {isLoading ? <p>Generando sugerencias con IA...</p> : 
                suggestion.split('\n').map((line, i) => {
                    if (line.startsWith('#')) return <h3 key={i} className="font-bold mt-2">{line.replace(/#/g, '')}</h3>
                    if (line.startsWith('*')) return <li key={i}>{line.substring(1).trim()}</li>
                    return <p key={i}>{line}</p>
                })
                }
            </div>
        </div>
    </div>
)

const LivestockPage: React.FC = () => {
     const [suggestion, setSuggestion] = useState<string | null>(null);
    const [suggestedAnimal, setSuggestedAnimal] = useState<Animal | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetSuggestion = async (animal: Animal) => {
        setSuggestedAnimal(animal);
        setIsLoading(true);
        const prompt = `Proporciona sugerencias de cuidado para una ${animal.type} con crotal ${animal.tag}, nacida el ${animal.birthDate}. Notas adicionales del ganadero: "${animal.notes}".`;
        const result = await getAiSuggestions(prompt);
        setSuggestion(result);
        setIsLoading(false);
    }

    return (
        <>
        <CrudTemplate<Animal>
            itemType="Animal"
            itemTypePlural="Gestión de Ganado"
            storageKey="livestock"
            initialItems={[]}
            renderItem={(item, onEdit, onDelete) => <AnimalItem item={item} onEdit={onEdit} onDelete={onDelete} onGetSuggestion={handleGetSuggestion} />}
            renderForm={(currentItem, setCurrentItem) => <AnimalForm currentItem={currentItem} setCurrentItem={setCurrentItem} />}
            getNewItem={() => ({ id: Date.now().toString(), tag: '', type: 'oveja', birthDate: new Date().toISOString().split('T')[0], notes: '' })}
        />
        {suggestedAnimal && (
             <AiSuggestionModal 
                suggestion={suggestion || ''} 
                animalTag={suggestedAnimal.tag}
                isLoading={isLoading}
                onClose={() => setSuggestedAnimal(null)} 
            />
        )}
        </>
    );
};

export default LivestockPage;
