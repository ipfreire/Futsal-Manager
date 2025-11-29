import { Athlete, ClubInfo, Game, GameDayCallup, TrainingPlan, User, UserRole, TrainingExercise, ExerciseCategory, Team, AgeGroup } from "./types";

export const MOCK_TEAMS: Team[] = [
    { id: 'team-1', name: 'Juniores A', ageGroup: AgeGroup.Juniores },
    { id: 'team-2', name: 'Benjamins B', ageGroup: AgeGroup.Benjamins },
];

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Mr. Silva', role: UserRole.Director, email: 'director@ufc.com' },
    { id: 'user-2', name: 'Coach Ricardo', role: UserRole.Coach, teamId: 'team-1', email: 'ricardo.coach@ufc.com', avatarUrl: `https://i.pravatar.cc/150?u=user-2` },
    { id: 'user-3', name: 'João', role: UserRole.Athlete, teamId: 'team-1', email: 'joao.player@email.com', avatarUrl: `https://i.pravatar.cc/150?u=user-3` },
    { id: 'user-4', name: 'Pedro', role: UserRole.Athlete, teamId: 'team-1', email: 'pedro.player@email.com', avatarUrl: `https://i.pravatar.cc/150?u=user-4` },
    { id: 'user-5', name: 'Coach Ana', role: UserRole.Coach, teamId: 'team-2', email: 'ana.coach@ufc.com', avatarUrl: `https://i.pravatar.cc/150?u=user-5` },
];

export const MOCK_ATHLETES: Athlete[] = [
    { id: 'athlete-1', teamId: 'team-1', name: 'João', number: 10, position: 'Fixo', stats: { goals: 5, assists: 3 }, dob: '2005-04-10', height: 175, weight: 70, strongFoot: 'Right', observations: 'Great vision and passing.' },
    { id: 'athlete-2', teamId: 'team-1', name: 'Pedro', number: 7, position: 'Ala', stats: { goals: 8, assists: 10 }, dob: '2006-01-15', height: 180, weight: 75, strongFoot: 'Left' },
    { id: 'athlete-3', teamId: 'team-1', name: 'Miguel', number: 1, position: 'Goleiro', stats: { goals: 0, assists: 1 }, dob: '2005-08-22', height: 185, weight: 80, strongFoot: 'Right' },
    { id: 'athlete-4', teamId: 'team-1', name: 'Carlos', number: 9, position: 'Pivô', stats: { goals: 12, assists: 2 }, dob: '2005-03-30' },
    { id: 'athlete-5', teamId: 'team-1', name: 'André', number: 5, position: 'Ala', stats: { goals: 3, assists: 7 }, dob: '2006-06-05' },
    { id: 'athlete-6', teamId: 'team-2', name: 'Tiago', number: 8, position: 'Universal', stats: { goals: 15, assists: 12 }, dob: '2012-02-18' },
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
        teamId: 'team-1',
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
        teamId: 'team-1',
        title: 'Corner Kick Routine #1',
        category: ExerciseCategory.SetPiece,
        athleteCount: '5',
        observations: 'Screen the keeper and attack the far post.',
        isShared: true,
        elements: []
    },
    {
        id: 'ex-3',
        teamId: 'team-1',
        title: '3v2 Fast Break',
        category: ExerciseCategory.Attack,
        athleteCount: '5+GK',
        observations: 'Emphasize quick passing and decision making.',
        isShared: false,
        elements: []
    },
    {
        id: 'ex-4',
        teamId: 'team-2',
        title: '1v1 Dribbling',
        category: ExerciseCategory.Attack,
        athleteCount: '2',
        observations: 'Work on feints and changes of pace.',
        isShared: true,
        elements: []
    }
];

export const MOCK_TRAINING_PLANS: TrainingPlan[] = [
    {
        id: 'tp-1',
        teamId: 'team-1',
        title: 'Defensive Session',
        date: '2024-07-25',
        exercises: [{exerciseId: 'ex-1', duration: 20}],
        observations: 'Main focus today is defensive shape.',
        isShared: true,
    },
    {
        id: 'tp-2',
        teamId: 'team-1',
        title: 'Attacking Drills',
        date: '2024-07-26',
        exercises: [{exerciseId: 'ex-3', duration: 25}],
        observations: 'Work on finishing and creating space.',
        isShared: false,
    },
    {
        id: 'tp-3',
        teamId: 'team-2',
        title: 'Fundamental Skills',
        date: '2024-07-27',
        exercises: [{exerciseId: 'ex-4', duration: 30}],
        observations: 'Focus on ball control.',
        isShared: true,
    }
];

export const MOCK_GAMES: Game[] = [
    {
        id: 'game-1',
        teamId: 'team-1',
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
        teamId: 'team-1',
        opponent: 'Westside Warriors',
        date: '2024-07-28',
        meetTime: '18:00',
        location: 'Central Sports Arena',
        calledUpPlayers: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4', 'athlete-5']
    }
];