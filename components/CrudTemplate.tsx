
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { PlusIcon, TrashIcon, EditIcon, SaveIcon, BackIcon } from './icons';

interface CrudTemplateProps<T extends { id: string }> {
  itemType: string;
  itemTypePlural: string;
  storageKey: string;
  initialItems: T[];
  renderItem: (item: T, onEdit: (item: T) => void, onDelete: (id: string) => void) => React.ReactNode;
  renderForm: (
    currentItem: T,
    setCurrentItem: React.Dispatch<React.SetStateAction<T>>,
    onSave: () => void
  ) => React.ReactNode;
  getNewItem: () => T;
}

const CrudTemplate = <T extends { id: string },>(
  { itemType, itemTypePlural, storageKey, initialItems, renderItem, renderForm, getNewItem }: CrudTemplateProps<T>
) => {
  const [items, setItems] = useLocalStorage<T[]>(storageKey, initialItems);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (item: T) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${itemType.toLowerCase()}?`)) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    if (currentItem) {
      if (items.some(item => item.id === currentItem.id)) {
        setItems(items.map(item => (item.id === currentItem.id ? currentItem : item)));
      } else {
        setItems([...items, currentItem]);
      }
    }
    setCurrentItem(null);
    setIsEditing(false);
  };
  
  const handleNew = () => {
    setCurrentItem(getNewItem());
    setIsEditing(true);
  };

  if (isEditing && currentItem) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-200">
                <BackIcon className="w-6 h-6 text-text-primary" />
            </button>
            <h2 className="text-2xl font-bold text-primary">
              {items.some(n => n.id === currentItem.id) ? `Editar ${itemType}` : `Nuevo ${itemType}`}
            </h2>
            <button onClick={handleSave} className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark">
                <SaveIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="flex-grow overflow-y-auto">
            {renderForm(currentItem, setCurrentItem as React.Dispatch<React.SetStateAction<T>>, handleSave)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-primary mb-6">{itemTypePlural}</h1>
      <div className="space-y-4">
        {items.length === 0 ? (
            <p className="text-center text-text-secondary mt-8">No tienes {itemTypePlural.toLowerCase()} todavía. ¡Añade uno!</p>
        ) : (
            items.map(item => (
                <div key={item.id} className="bg-surface p-4 rounded-lg shadow-md">
                    {renderItem(item, handleEdit, handleDelete)}
                </div>
            ))
        )}
      </div>
      <button
        onClick={handleNew}
        className="fixed bottom-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transform hover:scale-110 transition"
      >
        <PlusIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default CrudTemplate;
