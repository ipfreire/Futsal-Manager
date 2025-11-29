import React, { useState, useRef, DragEvent } from 'react';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { TrainingExercise, TrainingExerciseElement, TrainingPlan, ExerciseCategory } from '../../types';
import FutsalCourt from '../shared/FutsalCourt';
// FIX: Import missing 'Footprints', 'Disc', and 'Square' icons from 'lucide-react'.
import { PlusCircle, Trash2, Share2, Edit, BookOpen, List, Footprints, Disc, Square } from 'lucide-react';

const TrainingPlanner: React.FC = () => {
    const { trainingPlans, setTrainingPlans, exercises, setExercises } = useData();
    const { t } = useI18n();
    const [view, setView] = useState<'units' | 'exercises'>('units');
    const [editingPlan, setEditingPlan] = useState<Partial<TrainingPlan> | null>(null);
    const [editingExercise, setEditingExercise] = useState<Partial<TrainingExercise> | null>(null);

    // Group exercises by category for the library view
    const exercisesByCategory = exercises.reduce((acc, ex) => {
        if (!acc[ex.category]) {
            acc[ex.category] = [];
        }
        acc[ex.category].push(ex);
        return acc;
    }, {} as Record<ExerciseCategory, TrainingExercise[]>);

    // Handlers
    const handleSavePlan = () => {
        if (!editingPlan) return;
        setTrainingPlans(prev => {
            if (editingPlan.id) {
                return prev.map(p => p.id === editingPlan.id ? { ...p, ...editingPlan } as TrainingPlan : p);
            }
            const newPlan: TrainingPlan = {
                id: `tp-${Date.now()}`,
                title: 'New Training Unit',
                date: new Date().toISOString().split('T')[0],
                isShared: false,
                observations: '',
                exerciseIds: [],
                ...editingPlan,
            };
            return [...prev, newPlan];
        });
        setEditingPlan(null);
    };

    const handleDeletePlan = (planId: string) => {
        if (window.confirm(t('trainingPlanner.deleteUnitConfirm'))) {
            setTrainingPlans(prev => prev.filter(p => p.id !== planId));
        }
    };
    
    const handleSaveExercise = () => {
        if (!editingExercise) return;
        setExercises(prev => {
            if (editingExercise.id) {
                return prev.map(e => e.id === editingExercise.id ? { ...e, ...editingExercise } as TrainingExercise : e);
            }
            const newEx: TrainingExercise = {
                id: `ex-${Date.now()}`,
                title: 'New Exercise',
                category: ExerciseCategory.Attack,
                athleteCount: 'N/A',
                observations: '',
                elements: [],
                isShared: false,
                ...editingExercise
            };
            return [...prev, newEx];
        });
        setEditingExercise(null);
    };

    const handleDeleteExercise = (exerciseId: string) => {
        if (window.confirm(t('trainingPlanner.deleteExerciseConfirm'))) {
            setExercises(prev => prev.filter(e => e.id !== exerciseId));
            // Also remove from any training plans
            setTrainingPlans(prev => prev.map(p => ({
                ...p,
                exerciseIds: p.exerciseIds.filter(id => id !== exerciseId)
            })));
        }
    };

    const togglePlanExercise = (plan: Partial<TrainingPlan>, exerciseId: string) => {
        const currentIds = plan.exerciseIds || [];
        const newIds = currentIds.includes(exerciseId)
            ? currentIds.filter(id => id !== exerciseId)
            : [...currentIds, exerciseId];
        setEditingPlan({...plan, exerciseIds: newIds});
    };
    
    // UI Components
    const PlanEditor = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-3xl">
                <h3 className="text-xl font-bold mb-4">{editingPlan?.id ? t('trainingPlanner.editUnit') : t('trainingPlanner.createUnit')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={editingPlan?.title || ''} onChange={e => setEditingPlan({...editingPlan, title: e.target.value})} placeholder={t('trainingPlanner.unitTitle')} className="bg-gray-700 p-2 rounded"/>
                    <input type="date" value={editingPlan?.date || ''} onChange={e => setEditingPlan({...editingPlan, date: e.target.value})} className="bg-gray-700 p-2 rounded"/>
                    <textarea value={editingPlan?.observations || ''} onChange={e => setEditingPlan({...editingPlan, observations: e.target.value})} placeholder={t('trainingPlanner.observationsPlaceholder')} className="md:col-span-2 bg-gray-700 p-2 rounded" rows={2}/>
                </div>
                <h4 className="font-semibold mt-4 mb-2">{t('trainingPlanner.selectExercises')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {exercises.map(ex => (
                        <label key={ex.id} className={`flex items-center space-x-2 p-2 rounded cursor-pointer text-sm ${editingPlan?.exerciseIds?.includes(ex.id) ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                            <input type="checkbox" checked={editingPlan?.exerciseIds?.includes(ex.id)} onChange={() => togglePlanExercise(editingPlan!, ex.id)} className="form-checkbox h-4 w-4 text-indigo-500 bg-gray-900 border-gray-600 rounded focus:ring-indigo-500"/>
                            <span>{ex.title}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={() => setEditingPlan(null)} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500">{t('common.cancel')}</button>
                    <button onClick={handleSavePlan} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{t('trainingPlanner.saveUnit')}</button>
                </div>
            </div>
        </div>
    );

    const ExerciseEditor = () => {
        const courtRef = useRef<SVGSVGElement>(null);
        const onDragStart = (e: DragEvent, type: 'player' | 'cone' | 'ball' | 'note') => e.dataTransfer.setData('element-type', type);
        const onDrop = (e: DragEvent) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('element-type') as TrainingExerciseElement['type'];
            if (!type || !courtRef.current) return;

            const courtBounds = courtRef.current.getBoundingClientRect();
            const x = parseFloat(((e.clientX - courtBounds.left) / courtBounds.width * 100).toFixed(2));
            const y = parseFloat(((e.clientY - courtBounds.top) / courtBounds.height * 100).toFixed(2));

            const newElement: TrainingExerciseElement = {
                id: `el-${Date.now()}`, type, position: { x, y },
                label: type === 'player' ? 'P' : (type === 'note' ? 'Note' : ''),
            };
            const currentElements = editingExercise?.elements || [];
            setEditingExercise({...editingExercise, elements: [...currentElements, newElement]});
        };
        const onDragOver = (e: DragEvent) => e.preventDefault();

        return (
             <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl">
                    <h3 className="text-xl font-bold mb-4">{editingExercise?.id ? t('trainingPlanner.editExercise') : t('trainingPlanner.createExercise')}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <input type="text" value={editingExercise?.title || ''} onChange={e => setEditingExercise({...editingExercise, title: e.target.value})} placeholder={t('trainingPlanner.exerciseTitle')} className="w-full bg-gray-700 p-2 rounded mb-2"/>
                            <select value={editingExercise?.category || ''} onChange={e => setEditingExercise({...editingExercise, category: e.target.value as ExerciseCategory})} className="w-full bg-gray-700 p-2 rounded mb-2">
                                {Object.values(ExerciseCategory).map(c => <option key={c} value={c}>{t(`exerciseCategories.${c.replace(' ', '')}`)}</option>)}
                            </select>
                            <input type="text" value={editingExercise?.athleteCount || ''} onChange={e => setEditingExercise({...editingExercise, athleteCount: e.target.value})} placeholder={t('trainingPlanner.athleteCountPlaceholder')} className="w-full bg-gray-700 p-2 rounded mb-2"/>
                            <textarea value={editingExercise?.observations || ''} onChange={e => setEditingExercise({...editingExercise, observations: e.target.value})} placeholder={t('common.observations')} className="w-full bg-gray-700 p-2 rounded" rows={3}/>
                        </div>
                        <div>
                             <div className="flex space-x-4 mb-2 p-2 bg-gray-900 rounded-md justify-around">
                                <div onDragStart={(e) => onDragStart(e, 'player')} draggable className="flex flex-col items-center cursor-grab text-white text-xs"><Footprints className="h-5 w-5"/>{t('trainingPlanner.player')}</div>
                                <div onDragStart={(e) => onDragStart(e, 'ball')} draggable className="flex flex-col items-center cursor-grab text-white text-xs"><Disc className="h-5 w-5 text-orange-400"/>{t('trainingPlanner.ball')}</div>
                                <div onDragStart={(e) => onDragStart(e, 'cone')} draggable className="flex flex-col items-center cursor-grab text-white text-xs"><div className="text-red-500 text-lg">▲</div>{t('trainingPlanner.cone')}</div>
                                <div onDragStart={(e) => onDragStart(e, 'note')} draggable className="flex flex-col items-center cursor-grab text-white text-xs"><Square className="h-5 w-5 text-yellow-400"/>{t('trainingPlanner.note')}</div>
                            </div>
                            <div ref={courtRef} onDrop={onDrop} onDragOver={onDragOver}>
                                <FutsalCourt>
                                    {editingExercise?.elements?.map(el => (
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
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button onClick={() => setEditingExercise(null)} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500">{t('common.cancel')}</button>
                        <button onClick={handleSaveExercise} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{t('trainingPlanner.saveExercise')}</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {editingPlan && <PlanEditor />}
            {editingExercise && <ExerciseEditor />}
            <div className="flex border-b border-gray-700 mb-6">
                <button onClick={() => setView('units')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${view === 'units' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}><List/> {t('trainingPlanner.trainingUnits')}</button>
                <button onClick={() => setView('exercises')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${view === 'exercises' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}><BookOpen/> {t('trainingPlanner.exerciseLibrary')}</button>
            </div>

            {view === 'units' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{t('trainingPlanner.trainingUnits')}</h3>
                        <button onClick={() => setEditingPlan({})} className="inline-flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"><PlusCircle size={18}/> {t('trainingPlanner.createUnitButton')}</button>
                    </div>
                    <div className="space-y-3">
                        {trainingPlans.map(p => (
                            <div key={p.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold">{p.title} <span className="text-sm font-normal text-gray-400">- {t('common.date')}: {p.date}</span></h4>
                                        <p className="text-xs text-gray-400 italic mt-1">{p.observations}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => setTrainingPlans(prev => prev.map(pl => pl.id === p.id ? {...pl, isShared: !pl.isShared} : pl))} title={p.isShared ? t("common.unshare") : t("common.share")} className={`${p.isShared ? 'text-green-400' : 'text-gray-500'} hover:text-white`}><Share2 size={18}/></button>
                                        <button onClick={() => setEditingPlan(p)} className="text-gray-400 hover:text-white"><Edit size={18}/></button>
                                        <button onClick={() => handleDeletePlan(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                                <ul className="mt-2 space-y-1">
                                    {p.exerciseIds.map(exId => {
                                        const ex = exercises.find(e => e.id === exId);
                                        return ex ? <li key={exId} className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">{ex.title} <span className="text-xs text-gray-500">({t(`exerciseCategories.${ex.category.replace(' ', '')}`)})</span></li> : null;
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'exercises' && (
                 <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{t('trainingPlanner.exerciseLibrary')}</h3>
                        <button onClick={() => setEditingExercise({})} className="inline-flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"><PlusCircle size={18}/> {t('trainingPlanner.createExerciseButton')}</button>
                    </div>
                    <div className="space-y-4">
                        {(Object.keys(exercisesByCategory) as ExerciseCategory[]).map(category => (
                            <div key={category}>
                                <h4 className="font-semibold text-indigo-400 mb-2">{t(`exerciseCategories.${category.replace(' ', '')}`)}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {exercisesByCategory[category].map(ex => (
                                    <div key={ex.id} className="bg-gray-800 p-3 rounded-lg flex flex-col justify-between">
                                        <div>
                                            <h5 className="font-bold">{ex.title}</h5>
                                            <p className="text-xs text-gray-400 mb-2">{t('trainingPlanner.athletes')}: {ex.athleteCount}</p>
                                            <p className="text-sm text-gray-300">{ex.observations}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 self-end">
                                            <button onClick={() => setExercises(prev => prev.map(e => e.id === ex.id ? {...e, isShared: !e.isShared} : e))} title={ex.isShared ? t("common.unshare") : t("common.share")} className={`${ex.isShared ? 'text-green-400' : 'text-gray-500'} hover:text-white`}><Share2 size={18}/></button>
                                            <button onClick={() => setEditingExercise(ex)} className="text-gray-400 hover:text-white"><Edit size={18}/></button>
                                            <button onClick={() => handleDeleteExercise(ex.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingPlanner;
