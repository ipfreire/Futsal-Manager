
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { Athlete } from '../../types';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

const RosterManagement: React.FC = () => {
  const { roster, setRoster } = useData();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [formData, setFormData] = useState({ name: '', number: '', position: '' });

  const openModal = (athlete: Athlete | null = null) => {
    setEditingAthlete(athlete);
    setFormData(athlete ? { name: athlete.name, number: String(athlete.number), position: athlete.position } : { name: '', number: '', position: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAthlete) {
      setRoster(roster.map(a => a.id === editingAthlete.id ? { ...a, name: formData.name, number: Number(formData.number), position: formData.position } : a));
    } else {
      const newAthlete: Athlete = {
        id: `athlete-${Date.now()}`,
        name: formData.name,
        number: Number(formData.number),
        position: formData.position,
        stats: { goals: 0, assists: 0 },
      };
      setRoster([...roster, newAthlete]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('roster.deleteConfirm'))) {
        setRoster(roster.filter(a => a.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">{t('roster.manageTitle')}</h3>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('roster.addAthlete')}
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-700">
          {roster.map(athlete => (
            <li key={athlete.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white font-bold">{athlete.number}</span>
                <div>
                  <p className="font-semibold text-white">{athlete.name}</p>
                  <p className="text-sm text-gray-400">{athlete.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => openModal(athlete)} className="p-2 text-gray-400 hover:text-white"><Edit className="h-5 w-5"/></button>
                <button onClick={() => handleDelete(athlete.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="h-5 w-5"/></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h4 className="text-xl font-bold mb-4">{editingAthlete ? t('roster.editAthlete') : t('roster.addNewAthlete')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('roster.name')} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              <input type="number" name="number" value={formData.number} onChange={handleChange} placeholder={t('roster.number')} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder={t('roster.position')} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={closeModal} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600">{t('common.cancel')}</button>
                <button type="submit" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{editingAthlete ? t('common.saveChanges') : t('roster.addAthlete')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterManagement;
