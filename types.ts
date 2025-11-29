export enum UserRole {
  Director = 'Director',
  Coach = 'Coach',
  Athlete = 'Athlete',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Athlete {
  id: string;
  name: string;
  number: number;
  position: string;
  stats: {
    goals: number;
    assists: number;
  };
}

export interface ClubInfo {
  name: string;
  foundationDate: string;
  memberCount: number;
  history: string;
}

export interface TrainingExerciseElement {
  id: string;
  type: 'player' | 'cone' | 'ball' | 'note';
  position: { x: number; y: number };
  label?: string; // For player number or note content
}

export enum ExerciseCategory {
    Attack = 'Attack',
    Defense = 'Defense',
    SetPiece = 'Set Piece',
}

export interface TrainingExercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  athleteCount: string; // e.g. "2v1", "4+GK", "All"
  observations: string;
  elements: TrainingExerciseElement[];
  isShared: boolean;
  // paths for animations could be added here
}

export interface TrainingPlan { // This is a "Training Unit"
  id: string;
  title: string;
  date: string;
  exerciseIds: string[]; // references to TrainingExercise
  observations: string;
  isShared: boolean;
}


export enum GameEventType {
    Goal = 'Goal',
    Assist = 'Assist',
    ShotOnTarget = 'Shot on Target',
    ShotOffTarget = 'Shot Off Target',
    Interception = 'Interception',
    Tackle = 'Tackle',
    Foul = 'Foul',
    YellowCard = 'Yellow Card',
    RedCard = 'Red Card',
    SubstitutionIn = 'Sub In',
    SubstitutionOut = 'Sub Out'
}

export interface GameEvent {
    id: string;
    timestamp: number; // in seconds from game start
    period: 1 | 2;
    type: GameEventType;
    playerId: string;
    playerName: string;
}

export interface Game {
    id: string;
    opponent: string;
    date: string;
    status: 'live' | 'finished';
    score: {
        own: number;
        opponent: number;
    };
    playersOnCourt: string[];
    playersOnBench: string[];
    events: GameEvent[];
    finalReport: string;
    isShared: boolean;
}

export interface GameDayCallup {
    id: string;
    opponent: string;
    date: string;
    meetTime: string;
    location: string;
    calledUpPlayers: string[]; // array of athlete IDs
}