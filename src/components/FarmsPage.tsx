import React, { useState } from 'react';
import { Farm, FarmType } from '../types';
import CrudTemplate from './CrudTemplate';
import { EditIcon, TrashIcon, AiIcon, CloseIcon } from './icons';
import { getAiSuggestions } from '../services/geminiService';

const FarmItem: React.FC<{item: Farm, onEdit: (item: Farm) => void, onDelete: (id: string) => void, onGetSuggestion: (farm: Farm) => void}> = ({ item, onEdit, onDelete, onGetSuggestion }) => (
    <>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-text-primary">{item.name}</h3>
                <p className="text-sm text-text-secondary capitalize">{item.type} - {item.location}</p>
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

const FarmForm: React.FC<{currentItem: Farm, setCurrentItem: React.Dispatch<React.SetStateAction<Farm>>}> = ({ currentItem, setCurrentItem }) => {
    const farmTypes: {value: FarmType, label: string}[] = [
        {value: 'olivar', label: 'Olivar'},
        {value: 'pinar', label: 'Pinar'},
        {value: 'frutales', label: 'Árboles Frutales'},
        {value: 'otro', label: 'Otro'},
    ]
    return (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-text-secondary">Nombre de la Finca</label>
            <input type="text" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Tipo de Finca</label>
            <select value={currentItem.type} onChange={e => setCurrentItem({...currentItem, type: e.target.value as FarmType})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                {farmTypes.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Ubicación</label>
            <input type="text" value={currentItem.location} onChange={e => setCurrentItem({...currentItem, location: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Notas</label>
            <textarea value={currentItem.notes} onChange={e => setCurrentItem({...currentItem, notes: e.target.value})} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
        </div>
    </div>
    )
};

const AiSuggestionModal: React.FC<{suggestion: string, farmName: string, onClose: () => void, isLoading: boolean}> = ({ suggestion, farmName, onClose, isLoading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-primary flex items-center gap-2"><AiIcon className="w-6 h-6" /> Sugerencias para {farmName}</h3>
                 <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon className="w-5 h-5"/></button>
            </div>
            <div className="flex-grow overflow-y-auto prose prose-sm max-w-none">
                {isLoading ? <p>Generando sugerencias con IA...</p> : 
                suggestion.split('\\n').map((line, i) => {
                    if (line.startsWith('#')) return <h3 key={i} className="font-bold mt-2">{line.replace(/#/g, '')}</h3>
                    if (line.startsWith('*')) return <li key={i}>{line.substring(1).trim()}</li>
                    return <p key={i}>{line}</p>
                })
                }
            </div>
        </div>
    </div>
)

const FarmsPage: React.FC = () => {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [suggestedFarm, setSuggestedFarm] = useState<Farm | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetSuggestion = async (farm: Farm) => {
        setSuggestedFarm(farm);
        setIsLoading(true);
        const prompt = `Proporciona sugerencias de cuidado para una finca de tipo '${farm.type}' llamada '${farm.name}', ubicada en '${farm.location}'. Notas adicionales del agricultor: "${farm.notes}".`;
        const result = await getAiSuggestions(prompt);
        setSuggestion(result);
        setIsLoading(false);
    }
    
    return (
        <>
        <CrudTemplate<Farm>
            itemType="Finca"
            itemTypePlural="Gestión de Fincas"
            storageKey="farms"
            initialItems={[]}
            renderItem={(item, onEdit, onDelete) => <FarmItem item={item} onEdit={onEdit} onDelete={onDelete} onGetSuggestion={handleGetSuggestion} />}
            renderForm={(currentItem, setCurrentItem) => <FarmForm currentItem={currentItem} setCurrentItem={setCurrentItem} />}
            getNewItem={() => ({ id: Date.now().toString(), name: '', type: 'olivar', location: '', notes: '' })}
        />
        {suggestedFarm && (
            <AiSuggestionModal 
                suggestion={suggestion || ''} 
                farmName={suggestedFarm.name}
                isLoading={isLoading}
                onClose={() => setSuggestedFarm(null)} 
            />
        )}
        </>
    );
};

export default FarmsPage;
