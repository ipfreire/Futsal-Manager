import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { Game, GameEvent, GameEventType } from '../../types';
import useTimer from '../../hooks/useTimer';
import { Play, Pause, RefreshCw, Goal, Shield, Flag, Square, FileText, CheckCircle } from 'lucide-react';

const LiveGameTracker: React.FC = () => {
    const { roster, games, setGames } = useData();
    const { t } = useI18n();
    
    const liveGame = games.find(g => g.status === 'live');

    const [period, setPeriod] = useState<1 | 2>(1);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [newOpponent, setNewOpponent] = useState('');
    const [gameDurationMinutes, setGameDurationMinutes] = useState(20);
    
    const { time, isRunning, start, pause, reset, formattedTime } = useTimer(gameDurationMinutes * 60);

    useEffect(() => {
        if (!isRunning) {
            reset(gameDurationMinutes * 60);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameDurationMinutes]);
    
    const selectedPlayer = roster.find(p => p.id === selectedPlayerId);

    const updateLiveGame = (updatedGame: Game) => {
        setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
    };

    const handleStartGame = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newOpponent) return;
        
        const newGame: Game = {
            id: `game-${Date.now()}`,
            teamId: roster[0]?.teamId || '', // Assume all players on one team
            opponent: newOpponent,
            date: new Date().toISOString().split('T')[0],
            status: 'live',
            score: { own: 0, opponent: 0 },
            playersOnCourt: roster.slice(0, 5).map(p => p.id),
            playersOnBench: roster.slice(5).map(p => p.id),
            events: [],
            finalReport: '',
            isShared: false,
        };
        setGames(prev => [...prev, newGame]);
        reset(gameDurationMinutes * 60);
        setNewOpponent('');
    };
    
    const addEvent = (type: GameEventType) => {
        if (!liveGame || !selectedPlayer) return;

        const newEvent: GameEvent = {
            id: `evt-${Date.now()}`,
            timestamp: time,
            type,
            period,
            playerId: selectedPlayer.id,
            playerName: selectedPlayer.name,
        };
        
        const scoreUpdate = type === GameEventType.Goal ? 1 : 0;
        
        const updatedGame: Game = {
            ...liveGame,
            events: [newEvent, ...liveGame.events],
            score: { ...liveGame.score, own: liveGame.score.own + scoreUpdate }
        };

        updateLiveGame(updatedGame);
        setSelectedPlayerId(null);
    };

    const handleSubstitute = (playerInId: string) => {
        if (liveGame && selectedPlayerId && liveGame.playersOnCourt.includes(selectedPlayerId)) {
            const newOnCourt = liveGame.playersOnCourt.filter(id => id !== selectedPlayerId).concat(playerInId);
            const newOnBench = liveGame.playersOnBench.filter(id => id !== playerInId).concat(selectedPlayerId);
            updateLiveGame({ ...liveGame, playersOnCourt: newOnCourt, playersOnBench: newOnBench });
            setSelectedPlayerId(null);
        }
    };
    
    const handleEndGame = () => {
        pause();
        setIsReportModalOpen(true);
    };
    
    const EventIcon = ({type}: {type: GameEventType}) => {
        switch(type) {
            case GameEventType.Goal: return <Goal className="h-4 w-4 text-green-400"/>;
            case GameEventType.ShotOnTarget: return <Shield className="h-4 w-4 text-blue-400"/>;
            case GameEventType.Foul: return <Flag className="h-4 w-4 text-yellow-400"/>;
            case GameEventType.YellowCard: return <Square className="h-4 w-4 text-yellow-500 fill-current"/>;
            default: return <FileText className="h-4 w-4 text-gray-400"/>;
        }
    };
    
    const FinalReportModal = () => {
        if (!liveGame) return null;
        const [observations, setObservations] = useState('');

        const handleSaveReport = (share: boolean) => {
            const finalGame: Game = {
                ...liveGame,
                status: 'finished',
                finalReport: observations,
                isShared: share
            };
            updateLiveGame(finalGame);
            setIsReportModalOpen(false);
            reset(gameDurationMinutes * 60);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
                    <h3 className="text-xl font-bold mb-4">{t('gameTracker.finalReportTitle')} vs {liveGame.opponent}</h3>
                    <div className="bg-gray-900 p-2 rounded-md max-h-60 overflow-y-auto mb-4">
                        <h4 className="font-semibold text-gray-300 mb-2">{t('gameTracker.gameLog')}</h4>
                        <ul>
                            {[...liveGame.events].reverse().map(e => {
                                const eventTime = (gameDurationMinutes * 60) - e.timestamp;
                                const minutes = Math.floor(eventTime / 60).toString().padStart(2, '0');
                                const seconds = (eventTime % 60).toString().padStart(2, '0');
                                return(
                                <li key={e.id} className="text-sm flex justify-between p-1 border-b border-gray-700">
                                    <span>{e.period}ªP - {minutes}:{seconds}</span>
                                    <span>{e.playerName}</span>
                                    <span>{t(`gameEvents.${e.type.replace(/\s/g, '')}`)}</span>
                                </li>
                            )})}
                        </ul>
                    </div>
                    <textarea value={observations} onChange={e => setObservations(e.target.value)} placeholder={t('gameTracker.reportObservations')} className="w-full bg-gray-700 p-2 rounded mb-4" rows={4}/>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsReportModalOpen(false)} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500">{t('common.cancel')}</button>
                        <button onClick={() => handleSaveReport(false)} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{t('common.saveChanges')}</button>
                        <button onClick={() => handleSaveReport(true)} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">{t('common.saveAndShare')}</button>
                    </div>
                </div>
            </div>
        );
    };

    if (!liveGame) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-white">{t('gameTracker.newGameTitle')}</h3>
                <form onSubmit={handleStartGame} className="space-y-4">
                    <input type="text" value={newOpponent} onChange={e => setNewOpponent(e.target.value)} placeholder={t('gameTracker.enterOpponent')} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
                    <button type="submit" className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">{t('gameTracker.startGame')}</button>
                </form>
            </div>
        );
    }
    
    const onCourtPlayers = roster.filter(p => liveGame.playersOnCourt.includes(p.id));
    const onBenchPlayers = roster.filter(p => liveGame.playersOnBench.includes(p.id));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isReportModalOpen && <FinalReportModal/>}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold">Unidos FC <span className="text-indigo-400">{liveGame.score.own}</span></div>
                        <div className="text-center">
                            <div className="text-4xl font-mono">{formattedTime}</div>
                             <div className="flex items-center justify-center space-x-2 mt-2">
                                <label className="text-xs text-gray-400">{t('common.minutes')}:</label>
                                <input 
                                    type="number" 
                                    value={gameDurationMinutes} 
                                    onChange={(e) => setGameDurationMinutes(Number(e.target.value))}
                                    className="w-16 bg-gray-700 text-white text-center rounded p-1"
                                    disabled={isRunning}
                                />
                            </div>
                            <div className="flex justify-center space-x-2 mt-2">
                                <button onClick={isRunning ? pause : start} className="p-2 bg-gray-700 rounded-full">{isRunning ? <Pause/> : <Play/>}</button>
                                <button onClick={() => reset(gameDurationMinutes * 60)} className="p-2 bg-gray-700 rounded-full"><RefreshCw/></button>
                            </div>
                        </div>
                        <div className="text-2xl font-bold"><span className="text-red-400">{liveGame.score.opponent}</span> {liveGame.opponent}</div>
                    </div>
                    <div className="flex justify-center items-center gap-4 border-t border-gray-700 pt-2">
                        <div className="flex gap-2">
                            <button onClick={() => setPeriod(1)} className={`px-3 py-1 text-sm rounded ${period === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}>{t('gameTracker.firstHalf')}</button>
                            <button onClick={() => setPeriod(2)} className={`px-3 py-1 text-sm rounded ${period === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}>{t('gameTracker.secondHalf')}</button>
                        </div>
                        <button onClick={handleEndGame} className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"><CheckCircle size={16}/>{t('gameTracker.endGame')}</button>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{t('gameTracker.onCourt')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {onCourtPlayers.map(p => (
                            <button key={p.id} onClick={() => setSelectedPlayerId(p.id)} className={`p-2 rounded text-center w-20 ${selectedPlayerId === p.id ? 'bg-indigo-600 ring-2 ring-white' : 'bg-gray-700'}`}>
                                <div className="font-bold">{p.number}</div>
                                <div className="text-xs truncate">{p.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{t('gameTracker.bench')}</h4>
                     <div className="flex flex-wrap gap-2">
                        {onBenchPlayers.map(p => (
                            <button key={p.id} onClick={() => handleSubstitute(p.id)} className="p-2 rounded text-center bg-gray-700 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed w-20" disabled={!selectedPlayerId || !liveGame.playersOnCourt.includes(selectedPlayerId)}>
                                <div className="font-bold">{p.number}</div>
                                <div className="text-xs truncate">{p.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <div>
                    <h4 className="font-bold mb-2">{t('gameTracker.actionsFor')} <span className="text-indigo-400">{selectedPlayer?.name || '...'}</span></h4>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(GameEventType).filter(v => v !== GameEventType.SubstitutionIn && v !== GameEventType.SubstitutionOut).map(type => (
                             <button key={type} onClick={() => addEvent(type)} className="p-2 bg-gray-700 rounded text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedPlayerId}>{t(`gameEvents.${type.replace(/\s/g, '')}`)}</button>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="font-bold mb-2">{t('gameTracker.gameLog')}</h4>
                    <ul className="h-64 overflow-y-auto space-y-1 text-sm pr-2">
                        {liveGame.events.map(e => {
                            const eventTime = (gameDurationMinutes * 60) - e.timestamp;
                            const minutes = Math.floor(eventTime / 60).toString().padStart(2, '0');
                            const seconds = (eventTime % 60).toString().padStart(2, '0');
                            return (
                             <li key={e.id} className="flex items-center justify-between bg-gray-700 p-1 rounded">
                                <span className="font-mono text-gray-400">{e.period}ª - {minutes}:{seconds}</span>
                                <span className="flex items-center gap-1"><EventIcon type={e.type}/>{t(`gameEvents.${e.type.replace(/\s/g, '')}`)}</span>
                                <span>{e.playerName}</span>
                            </li>
                        )})}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LiveGameTracker;