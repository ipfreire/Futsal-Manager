import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Athlete, ClubInfo, Game, GameDayCallup, TrainingPlan, TrainingExercise, Team, UserRole } from '../types';
import { MOCK_ATHLETES, MOCK_CLUB_INFO, MOCK_GAMES, MOCK_TRAINING_PLANS, MOCK_CALLUPS, MOCK_EXERCISES, MOCK_TEAMS } from '../constants';
import { useAuth } from './AuthContext';

interface DataContextType {
  clubInfo: ClubInfo;
  setClubInfo: React.Dispatch<React.SetStateAction<ClubInfo>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  roster: Athlete[];
  setRoster: React.Dispatch<React.SetStateAction<Athlete[]>>;
  trainingPlans: TrainingPlan[];
  setTrainingPlans: React.Dispatch<React.SetStateAction<TrainingPlan[]>>;
  exercises: TrainingExercise[];
  setExercises: React.Dispatch<React.SetStateAction<TrainingExercise[]>>;
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  callups: GameDayCallup[];
  setCallups: React.Dispatch<React.SetStateAction<GameDayCallup[]>>;
  
  // A function to get the full, unfiltered roster, useful for directors
  getFullRoster: () => Athlete[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [clubInfo, setClubInfo] = useLocalStorage<ClubInfo>('futsal_clubInfo', MOCK_CLUB_INFO);
  const [teams, setTeams] = useLocalStorage<Team[]>('futsal_teams', MOCK_TEAMS);
  const [roster, setRoster] = useLocalStorage<Athlete[]>('futsal_roster', MOCK_ATHLETES);
  const [trainingPlans, setTrainingPlans] = useLocalStorage<TrainingPlan[]>('futsal_trainingPlans', MOCK_TRAINING_PLANS);
  const [exercises, setExercises] = useLocalStorage<TrainingExercise[]>('futsal_exercises', MOCK_EXERCISES);
  const [games, setGames] = useLocalStorage<Game[]>('futsal_games', MOCK_GAMES);
  const [callups, setCallups] = useLocalStorage<GameDayCallup[]>('futsal_callups', MOCK_CALLUPS);

  // Memoize filtered data to prevent unnecessary re-renders
  const teamScopedData = useMemo(() => {
    if (!user || user.role === UserRole.Director) {
        return { roster, trainingPlans, exercises, games, callups };
    }

    const teamId = user.teamId;
    if (!teamId) {
        return { roster: [], trainingPlans: [], exercises: [], games: [], callups: [] };
    }

    return {
        roster: roster.filter(a => a.teamId === teamId),
        trainingPlans: trainingPlans.filter(p => p.teamId === teamId),
        exercises: exercises.filter(e => e.teamId === teamId),
        games: games.filter(g => g.teamId === teamId),
        callups: callups.filter(c => c.teamId === teamId),
    };
  }, [user, roster, trainingPlans, exercises, games, callups]);
  
  const getFullRoster = () => roster;

  return (
    <DataContext.Provider value={{ 
        clubInfo, setClubInfo, 
        teams, setTeams,
        roster: teamScopedData.roster, setRoster, 
        trainingPlans: teamScopedData.trainingPlans, setTrainingPlans, 
        exercises: teamScopedData.exercises, setExercises, 
        games: teamScopedData.games, setGames, 
        callups: teamScopedData.callups, setCallups,
        getFullRoster
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};