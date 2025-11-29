import { Athlete, ClubInfo, Game, GameDayCallup, TrainingPlan, User, UserRole, TrainingExercise, ExerciseCategory } from "./types";

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Mr. Silva', role: UserRole.Director },
    { id: 'user-2', name: 'Coach Ricardo', role: UserRole.Coach },
    { id: 'user-3', name: 'João', role: UserRole.Athlete },
    { id: 'user-4', name: 'Pedro', role: UserRole.Athlete }
];

export const MOCK_ATHLETES: Athlete[] = [
    { id: 'athlete-1', name: 'João', number: 10, position: 'Fixo', stats: { goals: 5, assists: 3 } },
    { id: 'athlete-2', name: 'Pedro', number: 7, position: 'Ala', stats: { goals: 8, assists: 10 } },
    { id: 'athlete-3', name: 'Miguel', number: 1, position: 'Goleiro', stats: { goals: 0, assists: 1 } },
    { id: 'athlete-4', name: 'Carlos', number: 9, position: 'Pivô', stats: { goals: 12, assists: 2 } },
    { id: 'athlete-5', name: 'André', number: 5, position: 'Ala', stats: { goals: 3, assists: 7 } },
];

export const MOCK_CLUB_INFO: ClubInfo = {
    name: "Unidos Futsal Clube",
    foundationDate: "1998-05-12",
    memberCount: 250,
    history: "Founded by a group of friends, our club has grown to be a competitive force in the regional league, focusing on community and sportsmanship."
};

export const MOCK_EXERCISES: TrainingExercise[] = [
    {
        id: 'ex-1',
        title: '2v2 Zone Defense',
        category: ExerciseCategory.Defense,
        athleteCount: '4',
        observations: 'Focus on communication and covering passing lanes.',
        isShared: true,
        elements: [
            { id: 'el-1', type: 'player', position: { x: 20, y: 30 }, label: 'D1' },
            { id: 'el-2', type: 'player', position: { x: 80, y: 30 }, label: 'D2' },
            { id: 'el-3', type: 'player', position: { x: 30, y: 70 }, label: 'A1' },
            { id: 'el-4', type: 'player', position: { x: 70, y: 70 }, label: 'A2' },
            { id: 'el-5', type: 'ball', position: { x: 50, y: 50 } },
            { id: 'el-6', type: 'note', position: { x: 50, y: 10 }, label: 'Keep tight formation!' }
        ]
    },
    {
        id: 'ex-2',
        title: 'Corner Kick Routine #1',
        category: ExerciseCategory.SetPiece,
        athleteCount: '5',
        observations: 'Screen the keeper and attack the far post.',
        isShared: true,
        elements: []
    },
    {
        id: 'ex-3',
        title: '3v2 Fast Break',
        category: ExerciseCategory.Attack,
        athleteCount: '5+GK',
        observations: 'Emphasize quick passing and decision making.',
        isShared: false,
        elements: []
    }
];

export const MOCK_TRAINING_PLANS: TrainingPlan[] = [
    {
        id: 'tp-1',
        title: 'Defensive Session',
        date: '2024-07-25',
        exerciseIds: ['ex-1'],
        observations: 'Main focus today is defensive shape. Each exercise 15 minutes.',
        isShared: true,
    },
    {
        id: 'tp-2',
        title: 'Attacking Drills',
        date: '2024-07-26',
        exerciseIds: ['ex-3'],
        observations: 'Work on finishing and creating space.',
        isShared: false,
    }
];

export const MOCK_GAMES: Game[] = [
    {
        id: 'game-1',
        opponent: 'City Rivals FC',
        date: '2024-07-20',
        status: 'finished',
        score: { own: 5, opponent: 3 },
        playersOnCourt: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4'],
        playersOnBench: ['athlete-5'],
        events: [],
        finalReport: 'Great win! Excellent performance from the attack, but we need to work on conceding fewer goals on counter-attacks.',
        isShared: true,
    }
];

export const MOCK_CALLUPS: GameDayCallup[] = [
    {
        id: 'callup-1',
        opponent: 'Westside Warriors',
        date: '2024-07-28',
        meetTime: '18:00',
        location: 'Central Sports Arena',
        calledUpPlayers: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4', 'athlete-5']
    }
];