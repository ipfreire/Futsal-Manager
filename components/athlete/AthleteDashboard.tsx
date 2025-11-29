import React, { useState } from 'react';
import MainLayout, { Shield, ClipboardList, Newspaper, BarChart2, Users } from '../layout/MainLayout';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import FutsalCourt from '../shared/FutsalCourt';
import { TrainingExercise, Game } from '../../types';

const AthleteDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('Call-ups');
  const { clubInfo, trainingPlans, games, callups, exercises } = useData();
  const { t } = useI18n();
  const [selectedExercise, setSelectedExercise] = useState<TrainingExercise | null>(null);
  const [viewingReport, setViewingReport] = useState<Game | null>(null);

  const sharedPlans = trainingPlans.filter(p => p.isShared);
  const sharedExercises = exercises.filter(e => e.isShared);
  const sharedReports = games.filter(g => g.status === 'finished' && g.isShared);
  const exercisesById = new Map(exercises.map(e => [e.id, e]));

  const navItems = [
    { name: 'Club Info', icon: <Shield className="h-5 w-5" />, onClick: () => setActiveView('Club Info') },
    { name: 'Call-ups', icon: <Newspaper className="h-5 w-5" />, onClick: () => setActiveView('Call-ups') },
    { name: 'Training Units', icon: <ClipboardList className="h-5 w-5" />, onClick: () => setActiveView('Training Units') },
    { name: 'Shared Exercises', icon: <Users className="h-5 w-5" />, onClick: () => setActiveView('Shared Exercises') },
    { name: 'Game Reports', icon: <BarChart2 className="h-5 w-5" />, onClick: () => setActiveView('Game Reports') },
  ];
  
  const translatedNavItems = navItems.map(item => ({...item, name: t(`navigation.${item.name.replace(/\s|-/g, '')}`)}))
  
  const translatedActiveView = t(`navigation.${activeView.replace(/\s|-/g, '')}`);
  
  const ExerciseDetailModal = ({exercise, onClose}: {exercise: TrainingExercise, onClose: () => void}) => (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-2">{exercise.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{exercise.observations}</p>
              <FutsalCourt>
                  {exercise.elements.map(el => (
                      <g key={el.id} transform={`translate(${el.position.x * 10}, ${el.position.y * 5})`}>
                          {el.type === 'player' && <><circle r="15" fill="blue" stroke="white" strokeWidth="2" /><text x="0" y="5" fill="white" textAnchor="middle" fontSize="12">{el.label}</text></>}
                          {el.type === 'ball' && <circle r="8" fill="orange" />}
                          {el.type === 'cone' && <path d="M-10 10 L10 10 L0 -10 Z" fill="red" />}
                          {el.type === 'note' && <text fill="yellow" fontSize="12">{el.label}</text>}
                      </g>
                  ))}
              </FutsalCourt>
          </div>
      </div>
  );
  
  const GameReportModal = ({game, onClose}: {game: Game, onClose: () => void}) => (
     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">{t('athlete.reportVs')} {game.opponent} <span className="text-base font-normal text-gray-400">({game.date})</span></h3>
                <p className="text-sm text-gray-300 italic mb-4">{game.finalReport}</p>
                <div className="bg-gray-900 p-2 rounded-md max-h-80 overflow-y-auto">
                    <h4 className="font-semibold text-gray-300 mb-2">{t('gameTracker.gameLog')}</h4>
                    <ul>
                        {[...game.events].reverse().map(e => (
                            <li key={e.id} className="text-sm flex justify-between p-1 border-b border-gray-700">
                                <span>{e.period}ªP - {new Date(e.timestamp * 1000).toISOString().substr(14, 5)}</span>
                                <span>{e.playerName}</span>
                                <span>{t(`gameEvents.${e.type.replace(/\s/g, '')}`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
          </div>
      </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'Club Info':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">{clubInfo.name}</h3>
            <p><span className="font-semibold">{t('athlete.founded')}:</span> {clubInfo.foundationDate}</p>
            <p><span className="font-semibold">{t('athlete.members')}:</span> {clubInfo.memberCount}</p>
            <p className="mt-4 text-gray-300">{clubInfo.history}</p>
          </div>
        );
      case 'Call-ups':
        return (
            <div className="space-y-4">
                {callups.map(callup => (
                  <div key={callup.id} className="bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-indigo-500">
                    <h4 className="text-xl font-bold">{t('athlete.gameVs')} {callup.opponent}</h4>
                    <p className="text-gray-300">{t('athlete.date')}: <span className="font-semibold">{callup.date}</span></p>
                    <p className="text-gray-300">{t('athlete.meetAt')}: <span className="font-semibold">{callup.meetTime}</span></p>
                    <p className="text-gray-300">{t('athlete.location')}: <span className="font-semibold">{callup.location}</span></p>
                  </div>
                ))}
            </div>
        );
      case 'Training Units':
        return (
            <div className="space-y-4">
                {sharedPlans.map(plan => (
                    <div key={plan.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <h4 className="text-lg font-bold">{plan.title}</h4>
                        <p className="text-sm text-gray-400">{plan.date}</p>
                        <p className="text-sm text-gray-300 italic my-2">{plan.observations}</p>
                        <ul className="mt-2 space-y-2">
                            {plan.exerciseIds.map(exId => {
                                const ex = exercisesById.get(exId);
                                return ex ? <li key={exId} onClick={() => setSelectedExercise(ex)} className="text-gray-200 text-sm ml-4 list-disc cursor-pointer hover:text-indigo-400">{ex.title}</li> : null
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        );
       case 'Shared Exercises':
        return (
            <div className="space-y-4">
                {sharedExercises.map(exercise => (
                    <div key={exercise.id} onClick={() => setSelectedExercise(exercise)} className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
                        <h4 className="text-lg font-bold">{exercise.title}</h4>
                        <p className="text-sm text-gray-400">{t(`exerciseCategories.${exercise.category.replace(' ', '')}`)} - {exercise.athleteCount}</p>
                        <p className="mt-2 text-gray-300 text-sm">{exercise.observations}</p>
                    </div>
                ))}
            </div>
        );
      case 'Game Reports':
        return (
            <div className="space-y-4">
                {sharedReports.map(game => (
                    <div key={game.id} className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700" onClick={() => setViewingReport(game)}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold">{t('athlete.reportVs')} {game.opponent}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${game.score.own > game.score.opponent ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>
                                {game.score.own} - {game.score.opponent}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400">{game.date}</p>
                        <p className="mt-2 text-gray-300 truncate">{game.finalReport}</p>
                    </div>
                ))}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout navItems={translatedNavItems} activeView={translatedActiveView}>
      {selectedExercise && <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)}/>}
      {viewingReport && <GameReportModal game={viewingReport} onClose={() => setViewingReport(null)} />}
      {renderContent()}
    </MainLayout>
  );
};

export default AthleteDashboard;