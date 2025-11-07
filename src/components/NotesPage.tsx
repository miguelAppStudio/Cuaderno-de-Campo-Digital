import React, { useState, useRef } from 'react';
import { Note } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { PlusIcon, TrashIcon, EditIcon, SaveIcon, CameraIcon, BackIcon } from './icons';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (note: Note) => {
    setCurrentNote({ ...note });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const handleSave = () => {
    if (currentNote) {
      if (notes.some(n => n.id === currentNote.id)) {
        setNotes(notes.map(n => (n.id === currentNote.id ? currentNote : n)));
      } else {
        setNotes([...notes, currentNote]);
      }
    }
    setCurrentNote(null);
    setIsEditing(false);
  };
  
  const handleNewNote = () => {
    setCurrentNote({
      id: Date.now().toString(),
      text: '',
      createdAt: new Date().toISOString(),
      photo: undefined,
    });
    setIsEditing(true);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && currentNote) {
          setCurrentNote({ ...currentNote, photo: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isEditing && currentNote) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-200">
                <BackIcon className="w-6 h-6 text-text-primary" />
            </button>
            <h2 className="text-2xl font-bold text-primary">
              {notes.some(n => n.id === currentNote.id) ? 'Editar Nota' : 'Nueva Nota'}
            </h2>
            <button onClick={handleSave} className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark">
                <SaveIcon className="w-6 h-6" />
            </button>
        </div>
        <textarea
          className="w-full flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          value={currentNote.text}
          onChange={(e) => setCurrentNote({ ...currentNote, text: e.target.value })}
          placeholder="Escribe tu nota aquí..."
        />
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handlePhotoCapture}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 bg-secondary text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            <CameraIcon className="w-6 h-6" />
            {currentNote.photo ? 'Cambiar Foto' : 'Añadir Foto'}
          </button>
          {currentNote.photo && (
            <div className="mt-4">
              <img src={currentNote.photo} alt="Vista previa" className="rounded-lg max-h-60 w-full object-contain" />
              <button onClick={() => setCurrentNote({...currentNote, photo: undefined})} className="text-red-500 text-sm mt-2 hover:underline">Eliminar foto</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-primary mb-6">Mis Notas</h1>
      <div className="space-y-4">
        {notes.length === 0 ? (
            <p className="text-center text-text-secondary mt-8">No tienes notas todavía. ¡Añade una!</p>
        ) : (
            notes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(note => (
          <div key={note.id} className="bg-surface p-4 rounded-lg shadow-md flex flex-col">
            {note.photo && <img src={note.photo} alt="Nota" className="rounded-md mb-3 max-h-48 w-full object-cover"/>}
            <p className="text-text-primary flex-grow whitespace-pre-wrap">{note.text}</p>
            <p className="text-xs text-text-secondary mt-2">{new Date(note.createdAt).toLocaleString('es-ES')}</p>
            <div className="flex justify-end gap-2 mt-3 border-t pt-3">
              <button onClick={() => handleEdit(note)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><EditIcon className="w-5 h-5"/></button>
              <button onClick={() => handleDelete(note.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
            </div>
          </div>
        )))}
      </div>
      <button
        onClick={handleNewNote}
        className="fixed bottom-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transform hover:scale-110 transition"
      >
        <PlusIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default NotesPage;
