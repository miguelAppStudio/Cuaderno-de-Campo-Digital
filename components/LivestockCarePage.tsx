
import React from 'react';
import { LivestockCare, Animal } from '../types';
import CrudTemplate from './CrudTemplate';
import useLocalStorage from '../hooks/useLocalStorage';
import { EditIcon, TrashIcon } from './icons';

const CareItem: React.FC<{item: LivestockCare, onEdit: (item: LivestockCare) => void, onDelete: (id: string) => void, animals: Animal[]}> = ({ item, onEdit, onDelete, animals }) => {
    const animal = animals.find(a => a.id === item.animalId);
    return (
        <>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-text-primary capitalize">{item.type}: {item.product}</h3>
                    <p className="text-sm text-text-secondary">Animal: <strong>{animal?.tag || 'Desconocido'} ({animal?.type})</strong></p>
                    <p className="text-sm text-text-secondary">Fecha: {new Date(item.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(item)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
            <p className="text-text-primary mt-2 whitespace-pre-wrap">{item.notes}</p>
        </>
    )
};

const CareForm: React.FC<{currentItem: LivestockCare, setCurrentItem: React.Dispatch<React.SetStateAction<LivestockCare>>, animals: Animal[]}> = ({ currentItem, setCurrentItem, animals }) => {
    const careTypes: {value: LivestockCare['type'], label: string}[] = [
        {value: 'vacuna', label: 'Vacuna'},
        {value: 'tratamiento', label: 'Tratamiento'},
        {value: 'alimentacion', label: 'Alimentación Especial'},
        {value: 'otro', label: 'Otro Cuidado'},
    ]
    return (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-text-secondary">Animal</label>
            <select value={currentItem.animalId} onChange={e => setCurrentItem({...currentItem, animalId: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="">Seleccionar animal...</option>
                {animals.map(a => <option key={a.id} value={a.id}>{a.tag} ({a.type})</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Tipo de Cuidado</label>
            <select value={currentItem.type} onChange={e => setCurrentItem({...currentItem, type: e.target.value as LivestockCare['type']})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                {careTypes.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Producto / Tratamiento</label>
            <input type="text" value={currentItem.product} onChange={e => setCurrentItem({...currentItem, product: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Fecha</label>
            <input type="date" value={currentItem.date} onChange={e => setCurrentItem({...currentItem, date: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Notas</label>
            <textarea value={currentItem.notes} onChange={e => setCurrentItem({...currentItem, notes: e.target.value})} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
        </div>
    </div>
)};

const LivestockCarePage: React.FC = () => {
    const [animals] = useLocalStorage<Animal[]>('livestock', []);
    
    if (animals.length === 0) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-3xl font-bold text-primary mb-6">Cuidado de Ganado</h1>
                <p className="text-text-secondary">Debes registrar al menos un animal antes de poder añadir cuidados.</p>
            </div>
        );
    }
    
    return (
        <CrudTemplate<LivestockCare>
            itemType="Cuidado"
            itemTypePlural="Cuidado de Ganado"
            storageKey="livestock_care"
            initialItems={[]}
            renderItem={(item, onEdit, onDelete) => <CareItem item={item} onEdit={onEdit} onDelete={onDelete} animals={animals} />}
            renderForm={(currentItem, setCurrentItem) => <CareForm currentItem={currentItem} setCurrentItem={setCurrentItem} animals={animals} />}
            getNewItem={() => ({ id: Date.now().toString(), animalId: animals[0]?.id || '', type: 'tratamiento', product: '', date: new Date().toISOString().split('T')[0], notes: '' })}
        />
    );
};

export default LivestockCarePage;
