import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Athlete, ClubInfo, Game, GameDayCallup, TrainingPlan, TrainingExercise } from '../types';
import { MOCK_ATHLETES, MOCK_CLUB_INFO, MOCK_GAMES, MOCK_TRAINING_PLANS, MOCK_CALLUPS, MOCK_EXERCISES } from '../constants';

interface DataContextType {
  clubInfo: ClubInfo;
  setClubInfo: React.Dispatch<React.SetStateAction<ClubInfo>>;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clubInfo, setClubInfo] = useLocalStorage<ClubInfo>('futsal_clubInfo', MOCK_CLUB_INFO);
  const [roster, setRoster] = useLocalStorage<Athlete[]>('futsal_roster', MOCK_ATHLETES);
  const [trainingPlans, setTrainingPlans] = useLocalStorage<TrainingPlan[]>('futsal_trainingPlans', MOCK_TRAINING_PLANS);
  const [exercises, setExercises] = useLocalStorage<TrainingExercise[]>('futsal_exercises', MOCK_EXERCISES);
  const [games, setGames] = useLocalStorage<Game[]>('futsal_games', MOCK_GAMES);
  const [callups, setCallups] = useLocalStorage<GameDayCallup[]>('futsal_callups', MOCK_CALLUPS);

  return (
    <DataContext.Provider value={{ clubInfo, setClubInfo, roster, setRoster, trainingPlans, setTrainingPlans, exercises, setExercises, games, setGames, callups, setCallups }}>
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