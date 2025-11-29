
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { GameDayCallup } from '../../types';
import { Send, PlusCircle } from 'lucide-react';

const GameDayCallup: React.FC = () => {
  const { roster, callups, setCallups } = useData();
  const { t } = useI18n();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    meetTime: '',
    location: '',
    calledUpPlayers: [] as string[],
  });

  const handlePlayerToggle = (playerId: string) => {
    setFormData(prev => {
      const calledUpPlayers = prev.calledUpPlayers.includes(playerId)
        ? prev.calledUpPlayers.filter(id => id !== playerId)
        : [...prev.calledUpPlayers, playerId];
      return { ...prev, calledUpPlayers };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCallup: GameDayCallup = {
      id: `callup-${Date.now()}`,
      ...formData
    };
    setCallups([...callups, newCallup]);
    setIsCreating(false);
    setFormData({ opponent: '', date: '', meetTime: '', location: '', calledUpPlayers: [] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">{t('callup.title')}</h3>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('callup.newCallup')}
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h4 className="text-xl font-bold mb-4">{t('callup.createNew')}</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="opponent" value={formData.opponent} onChange={handleChange} placeholder={t('callup.opponent')} className="bg-gray-700 p-2 rounded" required/>
            <input name="date" type="date" value={formData.date} onChange={handleChange} className="bg-gray-700 p-2 rounded" required/>
            <input name="meetTime" type="time" value={formData.meetTime} onChange={handleChange} placeholder={t('callup.meetTime')} className="bg-gray-700 p-2 rounded" required/>
            <input name="location" value={formData.location} onChange={handleChange} placeholder={t('callup.location')} className="bg-gray-700 p-2 rounded" required/>
            <div className="md:col-span-2">
              <h5 className="font-semibold mb-2">{t('callup.selectPlayers')}</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {roster.map(athlete => (
                  <label key={athlete.id} className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${formData.calledUpPlayers.includes(athlete.id) ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                    <input type="checkbox" checked={formData.calledUpPlayers.includes(athlete.id)} onChange={() => handlePlayerToggle(athlete.id)} className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500"/>
                    <span>{athlete.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <button type="button" onClick={() => setIsCreating(false)} className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500">{t('common.cancel')}</button>
              <button type="submit" className="py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 inline-flex items-center"><Send className="mr-2 h-4 w-4"/>{t('callup.shareCallup')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {callups.map(callup => (
          <div key={callup.id} className="bg-gray-800 p-4 rounded-lg shadow">
            <h4 className="text-lg font-bold">vs {callup.opponent}</h4>
            <p className="text-sm text-gray-400">{callup.date} @ {callup.meetTime} - {callup.location}</p>
            <div className="mt-2">
              <p className="font-semibold">{t('callup.calledUp')}:</p>
              <ul className="flex flex-wrap gap-2 mt-1">
                {callup.calledUpPlayers.map(playerId => {
                    const player = roster.find(p => p.id === playerId);
                    return player ? <li key={playerId} className="bg-gray-700 text-xs px-2 py-1 rounded-full">{player.name}</li> : null;
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDayCallup;
