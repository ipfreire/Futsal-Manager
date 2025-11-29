
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { Game } from '../../types';
import { Edit, Share2 } from 'lucide-react';

const GameReports: React.FC = () => {
    const { games, setGames } = useData();
    const { t } = useI18n();
    const [editingReport, setEditingReport] = useState<Game | null>(null);

    const finishedGames = games.filter(g => g.status === 'finished');

    const handleSaveReport = (updatedReport: Game) => {
        setGames(prev => prev.map(g => g.id === updatedReport.id ? updatedReport : g));
        setEditingReport(null);
    };

    const ReportEditorModal = () => {
        if (!editingReport) return null;
        
        const [observations, setObservations] = useState(editingReport.finalReport);
        const [isShared, setIsShared] = useState(editingReport.isShared);

        const onSave = () => {
            handleSaveReport({
                ...editingReport,
                finalReport: observations,
                isShared: isShared,
            });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
                    <h3 className="text-xl font-bold mb-4">{t('reports.editTitle')} vs {editingReport.opponent}</h3>
                    <div className="bg-gray-900 p-2 rounded-md max-h-60 overflow-y-auto mb-4">
                        <h4 className="font-semibold text-gray-300 mb-2">{t('gameTracker.gameLog')}</h4>
                        <ul>
                            {[...editingReport.events].reverse().map(e => (
                                <li key={e.id} className="text-sm flex justify-between p-1 border-b border-gray-700">
                                    <span>{e.period}ªP - {new Date(e.timestamp * 1000).toISOString().substr(14, 5)}</span>
                                    <span>{e.playerName}</span>
                                    <span>{t(`gameEvents.${e.type.replace(/\s/g, '')}`)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <textarea value={observations} onChange={e => setObservations(e.target.value)} placeholder={t('gameTracker.reportObservations')} className="w-full bg-gray-700 p-2 rounded mb-4" rows={4}/>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-gray-300">
                            <input type="checkbox" checked={isShared} onChange={() => setIsShared(!isShared)} className="form-check h-5 w-5 text-indigo-600 bg-gray-900 border-gray-600 rounded focus:ring-indigo-500"/>
                            <span>{t('reports.shareWithAthletes')}</span>
                        </label>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingReport(null)} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500">{t('common.cancel')}</button>
                            <button onClick={onSave} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{t('common.saveChanges')}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {editingReport && <ReportEditorModal />}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">{t('reports.title')}</h3>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <ul className="divide-y divide-gray-700">
                    {finishedGames.length > 0 ? finishedGames.map(game => (
                        <li key={game.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">vs {game.opponent} <span className="text-sm font-normal text-gray-400">({game.date})</span></p>
                                <p className="text-sm text-gray-400">{t('viewTeam.score')}: {game.score.own} - {game.score.opponent}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {game.isShared ? (
                                    <span className="flex items-center text-xs text-green-400"><Share2 size={14} className="mr-1"/> {t('reports.shared')}</span>
                                ) : (
                                    <span className="flex items-center text-xs text-gray-500"><Share2 size={14} className="mr-1"/> {t('reports.notShared')}</span>
                                )}
                                <button onClick={() => setEditingReport(game)} className="p-2 text-gray-400 hover:text-white"><Edit className="h-5 w-5"/></button>
                            </div>
                        </li>
                    )) : (
                        <p className="text-gray-400 text-center py-4">{t('reports.noReports')}</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default GameReports;
