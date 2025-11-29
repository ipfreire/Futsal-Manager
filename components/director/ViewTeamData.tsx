
import React from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';

const ViewTeamData: React.FC = () => {
  const { roster, trainingPlans, games } = useData();
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      {/* Roster Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-white">{t('viewTeam.rosterTitle')}</h3>
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
                <div className="text-right">
                    <p className="text-sm text-gray-300">{t('viewTeam.goals')}: {athlete.stats.goals}</p>
                    <p className="text-sm text-gray-300">{t('viewTeam.assists')}: {athlete.stats.assists}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Training Plans Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-white">{t('viewTeam.trainingPlansTitle')}</h3>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          {trainingPlans.length > 0 ? (
            <ul className="space-y-3">
              {trainingPlans.map(plan => (
                <li key={plan.id} className="bg-gray-700 p-3 rounded-md">
                  <p className="font-semibold text-white">{plan.title}</p>
                  <p className="text-sm text-gray-400">{t('viewTeam.date')}: {plan.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">{t('viewTeam.noTrainingPlans')}</p>
          )}
        </div>
      </div>

      {/* Game Reports Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-white">{t('viewTeam.gameReportsTitle')}</h3>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          {games.length > 0 ? (
            <ul className="space-y-3">
              {games.map(game => (
                <li key={game.id} className="bg-gray-700 p-3 rounded-md">
                  <p className="font-semibold text-white">vs {game.opponent} ({game.date})</p>
                  <p className="text-lg font-bold text-indigo-400">{t('viewTeam.score')}: {game.score.own} - {game.score.opponent}</p>
                  <p className="text-sm text-gray-300 mt-2">{game.finalReport}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">{t('viewTeam.noGameReports')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTeamData;
