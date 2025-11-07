import React from 'react';
import { FarmProduct, Farm } from '../types';
import CrudTemplate from './CrudTemplate';
import useLocalStorage from '../hooks/useLocalStorage';
import { EditIcon, TrashIcon } from './icons';

const ProductItem: React.FC<{item: FarmProduct, onEdit: (item: FarmProduct) => void, onDelete: (id: string) => void, farms: Farm[]}> = ({ item, onEdit, onDelete, farms }) => {
    const farm = farms.find(f => f.id === item.farmId);
    return (
        <>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-text-primary">{item.name}</h3>
                    <p className="text-sm text-text-secondary">Aplicado a: <strong>{farm?.name || 'Finca desconocida'}</strong></p>
                    <p className="text-sm text-text-secondary">Fecha: {new Date(item.applicationDate).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(item)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
            <p className="text-text-primary mt-2 whitespace-pre-wrap">{item.description}</p>
        </>
    )
};

const ProductForm: React.FC<{currentItem: FarmProduct, setCurrentItem: React.Dispatch<React.SetStateAction<FarmProduct>>, farms: Farm[]}> = ({ currentItem, setCurrentItem, farms }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-text-secondary">Nombre del Producto</label>
            <input type="text" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Finca</label>
            <select value={currentItem.farmId} onChange={e => setCurrentItem({...currentItem, farmId: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="">Seleccionar finca...</option>
                {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Fecha de Aplicación</label>
            <input type="date" value={currentItem.applicationDate} onChange={e => setCurrentItem({...currentItem, applicationDate: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary">Descripción / Dosis</label>
            <textarea value={currentItem.description} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
        </div>
    </div>
);

const FarmProductsPage: React.FC = () => {
    const [farms] = useLocalStorage<Farm[]>('farms', []);

    if (farms.length === 0) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-3xl font-bold text-primary mb-6">Productos Fitosanitarios</h1>
                <p className="text-text-secondary">Debes crear al menos una finca antes de poder añadir productos.</p>
            </div>
        );
    }
    
    return (
        <CrudTemplate<FarmProduct>
            itemType="Producto"
            itemTypePlural="Productos Fitosanitarios (Fincas)"
            storageKey="farm_products"
            initialItems={[]}
            renderItem={(item, onEdit, onDelete) => <ProductItem item={item} onEdit={onEdit} onDelete={onDelete} farms={farms} />}
            renderForm={(currentItem, setCurrentItem) => <ProductForm currentItem={currentItem} setCurrentItem={setCurrentItem} farms={farms} />}
            getNewItem={() => ({ id: Date.now().toString(), name: '', description: '', applicationDate: new Date().toISOString().split('T')[0], farmId: farms[0]?.id || '' })}
        />
    );
};

export default FarmProductsPage;
