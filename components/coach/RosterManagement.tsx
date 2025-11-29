import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { Athlete } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Trash2, Edit, Link, UserCircle2 } from 'lucide-react';

// FIX: Omit 'height' and 'weight' from Athlete type before redefining them as strings to avoid type conflict (number & string = never).
type AthleteFormData = Omit<Athlete, 'id' | 'teamId' | 'stats' | 'number' | 'height' | 'weight'> & { number: string, height?: string, weight?: string };

const RosterManagement: React.FC = () => {
  const { roster, setRoster } = useData();
  const { user } = useAuth();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  
  const initialFormData: AthleteFormData = {
      name: '', number: '', position: '', photoUrl: '', dob: '', height: '', weight: '', strongFoot: 'Right', observations: ''
  };
  const [formData, setFormData] = useState<AthleteFormData>(initialFormData);

  const openModal = (athlete: Athlete | null = null) => {
    setEditingAthlete(athlete);
    if (athlete) {
        setFormData({
            ...athlete,
            number: String(athlete.number),
            height: athlete.height ? String(athlete.height) : '',
            weight: athlete.weight ? String(athlete.weight) : '',
        });
    } else {
        setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, photoUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.teamId) return;

    const athleteData = {
        ...formData,
        number: Number(formData.number),
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
    };
    
    if (editingAthlete) {
      setRoster(roster.map(a => a.id === editingAthlete.id ? { ...editingAthlete, ...athleteData } : a));
    } else {
      const newAthlete: Athlete = {
        ...athleteData,
        id: `athlete-${Date.now()}`,
        teamId: user.teamId,
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
  
  const generateInviteLink = () => {
    if (!user?.teamId) return;
    const link = `${window.location.origin}/invite/player/${user.teamId}`;
    setInviteLink(link);
    navigator.clipboard.writeText(link);
    setTimeout(() => setInviteLink(''), 3000);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">{t('roster.manageTitle')}</h3>
            <div className="flex space-x-2">
                <button
                  onClick={generateInviteLink}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                  <Link className="mr-2 h-5 w-5" />
                  {t('roster.invitePlayers')}
                </button>
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {t('roster.addAthlete')}
                </button>
            </div>
        </div>

        {inviteLink && (
            <div className="bg-green-800 border border-green-600 text-green-200 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <strong className="font-bold">{t('teams.linkGenerated')}</strong>
                <span className="block sm:inline ml-2">{t('teams.linkCopied')}</span>
            </div>
        )}

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-700">
          {roster.map(athlete => (
            <li key={athlete.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={athlete.photoUrl || `https://ui-avatars.com/api/?name=${athlete.name.replace(' ', '+')}&background=6366f1&color=fff`} alt={athlete.name} className="h-12 w-12 rounded-full object-cover"/>
                <div>
                  <p className="font-semibold text-white">{athlete.name} (#{athlete.number})</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold mb-4">{editingAthlete ? t('roster.editAthlete') : t('roster.addNewAthlete')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('athlete.name')} className="w-full bg-gray-700 p-2 rounded" required />
                  <input type="number" name="number" value={formData.number} onChange={handleChange} placeholder={t('athlete.number')} className="w-full bg-gray-700 p-2 rounded" required />
                  <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder={t('athlete.position')} className="w-full bg-gray-700 p-2 rounded" required />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
                  <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder={t('athlete.height')} className="w-full bg-gray-700 p-2 rounded" />
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder={t('athlete.weight')} className="w-full bg-gray-700 p-2 rounded" />
                   <select name="strongFoot" value={formData.strongFoot} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded">
                    <option value="Right">{t('athlete.rightFoot')}</option>
                    <option value="Left">{t('athlete.leftFoot')}</option>
                    <option value="Both">{t('athlete.bothFeet')}</option>
                  </select>
              </div>
               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('athlete.photo')}</label>
                  <div className="flex items-center space-x-4">
                      {formData.photoUrl ? (
                          <img src={formData.photoUrl} alt="Athlete preview" className="h-20 w-20 rounded-full object-cover" />
                      ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                              <UserCircle2 className="h-10 w-10" />
                          </div>
                      )}
                      <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      <label htmlFor="photo-upload" className="cursor-pointer py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-500">
                          {t('athlete.uploadPhoto')}
                      </label>
                  </div>
              </div>
              <textarea name="observations" value={formData.observations} onChange={handleChange} placeholder={t('common.observations')} className="w-full bg-gray-700 p-2 rounded" rows={3}/>
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