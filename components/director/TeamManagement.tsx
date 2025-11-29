import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { Team, AgeGroup } from '../../types';
import { PlusCircle, Trash2, Link } from 'lucide-react';

const TeamManagement: React.FC = () => {
    const { teams, setTeams } = useData();
    const { t } = useI18n();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ name: string; ageGroup: AgeGroup }>({ name: '', ageGroup: AgeGroup.Juniores });
    const [inviteLink, setInviteLink] = useState('');

    const openModal = () => {
        setFormData({ name: '', ageGroup: AgeGroup.Juniores });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTeam: Team = {
            id: `team-${Date.now()}`,
            ...formData
        };
        setTeams(prev => [...prev, newTeam]);
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('teams.deleteConfirm'))) {
            setTeams(prev => prev.filter(t => t.id !== id));
        }
    };
    
    const generateInviteLink = (teamId: string) => {
        const link = `${window.location.origin}/invite/coach/${teamId}`;
        setInviteLink(link);
        navigator.clipboard.writeText(link);
        setTimeout(() => setInviteLink(''), 3000);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">{t('teams.manageTitle')}</h3>
                <button
                    onClick={openModal}
                    className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    {t('teams.addTeam')}
                </button>
            </div>
            
            {inviteLink && (
                <div className="bg-green-800 border border-green-600 text-green-200 px-4 py-3 rounded-lg relative mb-4" role="alert">
                    <strong className="font-bold">{t('teams.linkGenerated')}</strong>
                    <span className="block sm:inline ml-2">{t('teams.linkCopied')}</span>
                </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <ul className="divide-y divide-gray-700">
                    {teams.map(team => (
                        <li key={team.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{team.name}</p>
                                <p className="text-sm text-gray-400">{t(`ageGroups.${team.ageGroup}`)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => generateInviteLink(team.id)} className="p-2 text-gray-400 hover:text-white" title={t('teams.coachInviteTooltip')}><Link className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(team.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="h-5 w-5"/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h4 className="text-xl font-bold mb-4">{t('teams.addNewTeam')}</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('teams.name')} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
                            <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required>
                                {Object.values(AgeGroup).map(ag => (
                                    <option key={ag} value={ag}>{t(`ageGroups.${ag}`)}</option>
                                ))}
                            </select>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={closeModal} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600">{t('common.cancel')}</button>
                                <button type="submit" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{t('teams.addTeam')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;