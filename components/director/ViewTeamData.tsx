import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { MOCK_ATHLETES, MOCK_TRAINING_PLANS, MOCK_GAMES } from '../../constants'; // Use full data for director

const ViewTeamData: React.FC = () => {
  const { teams } = useData();
  const { t } = useI18n();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  
  // Director sees all data, so we filter from the source mocks
  const filteredData = useMemo(() => {
    if (!selectedTeamId) {
      return { roster: [], trainingPlans: [], games: [] };
    }
    return {
        roster: MOCK_ATHLETES.filter(a => a.teamId === selectedTeamId),
        trainingPlans: MOCK_TRAINING_PLANS.filter(p => p.teamId === selectedTeamId),
        games: MOCK_GAMES.filter(g => g.teamId === selectedTeamId),
    };
  }, [selectedTeamId]);


  return (
    <div className="space-y-8">
      <div className="max-w-xs">
          <label htmlFor="team-select" className="block text-sm font-medium text-gray-300 mb-1">{t('teams.selectTeam')}</label>
          <select
              id="team-select"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
              {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
              ))}
          </select>
      </div>

      {/* Roster Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-white">{t('viewTeam.rosterTitle')}</h3>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-700">
            {filteredData.roster.map(athlete => (
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
          {filteredData.trainingPlans.length > 0 ? (
            <ul className="space-y-3">
              {filteredData.trainingPlans.map(plan => (
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
          {filteredData.games.length > 0 ? (
            <ul className="space-y-3">
              {filteredData.games.map(game => (
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