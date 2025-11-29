
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { ClubInfo } from '../../types';

const ClubInfoEditor: React.FC = () => {
  const { clubInfo, setClubInfo } = useData();
  const { t } = useI18n();
  const [formData, setFormData] = useState<ClubInfo>(clubInfo);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClubInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-white">{t('clubInfo.editTitle')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">{t('clubInfo.clubName')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="foundationDate" className="block text-sm font-medium text-gray-300">{t('clubInfo.foundationDate')}</label>
          <input
            type="date"
            id="foundationDate"
            name="foundationDate"
            value={formData.foundationDate}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="memberCount" className="block text-sm font-medium text-gray-300">{t('clubInfo.memberCount')}</label>
          <input
            type="number"
            id="memberCount"
            name="memberCount"
            value={formData.memberCount}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="history" className="block text-sm font-medium text-gray-300">{t('clubInfo.clubHistory')}</label>
          <textarea
            id="history"
            name="history"
            rows={4}
            value={formData.history}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end items-center">
            {isSaved && <span className="text-green-400 mr-4">{t('clubInfo.savedSuccess')}</span>}
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                {t('common.saveChanges')}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ClubInfoEditor;
