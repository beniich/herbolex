import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  User, 
  Timer,
  Play
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  location: string;
  timeDetail: string;
  column: 'todo' | 'progress' | 'verified';
}

interface AgroKanbanTasksProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroKanbanTasks({ onAddLog }: AgroKanbanTasksProps) {
  // Task State representing the exact items from the image
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Irrigate Field 4A', location: 'Field A', timeDetail: 'Due: Today, 2:00 PM', column: 'todo' },
    { id: 't2', title: 'Harvest Tomato Block 2', location: 'Block 2', timeDetail: 'Due: Today, 2:00 PM', column: 'todo' },
    { id: 't3', title: 'Check Sensor Status', location: 'Field A', timeDetail: 'Due: Today, 2:00 PM', column: 'todo' },
    { id: 't4', title: 'Apply Fertilizer Mix B', location: 'Field B', timeDetail: 'Due: Tomorrow, 9:00 AM', column: 'todo' },
    { id: 't5', title: 'Harvest Tomato Block 2', location: 'Block 2', timeDetail: 'Started: 10:30 AM', column: 'progress' },
    { id: 't6', title: 'Check Sensor Status', location: 'Field 2', timeDetail: 'Started: 11:45 AM', column: 'progress' },
    { id: 't7', title: 'Repair Fence Sector C', location: 'Sector C', timeDetail: 'Started: 11:45 AM', column: 'progress' },
    { id: 't8', title: 'Apply Fertilizer Mix B', location: 'Field A', timeDetail: 'Completed: Yesterday, 4:15 PM', column: 'verified' },
    { id: 't9', title: 'Apply Fertilizer Mix B', location: 'Field B', timeDetail: 'Completed: Today, 12:00 PM', column: 'verified' },
    { id: 'ta', title: 'Apply Fertilizer Mix B', location: 'Block C', timeDetail: 'Completed: Today, 12:00 PM', column: 'verified' },
  ]);

  // Form states to add custom tasks
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLoc, setNewTaskLoc] = useState('');
  
  // Quick Clock-In state
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer effect for clock-in
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      const now = new Date();
      setClockInTime(now);
      onAddLog('success', `KANBAN_TASKS: Enregistrement d'arrivée ("Clock-In") réussi à ${now.toLocaleTimeString()}. Shifts actif.`);
    } else {
      setIsClockedIn(false);
      const formattedDuration = formatTime(elapsedSeconds);
      onAddLog('warn', `KANBAN_TASKS: Enregistrement de sortie ("Clock-Out") validé. Durée cumulée du shift : ${formattedDuration}.`);
      setClockInTime(null);
    }
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const moveTask = (taskId: string, direction: 'next' | 'prev') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        let nextColumn = t.column;
        if (direction === 'next') {
          if (t.column === 'todo') {
            nextColumn = 'progress';
            onAddLog('info', `KANBAN_TASKS: Tâche "${t.title}" déplacée vers [En Cours]`);
          } else if (t.column === 'progress') {
            nextColumn = 'verified';
            onAddLog('success', `KANBAN_TASKS: Tâche "${t.title}" marquée comme [Vérifiée]`);
          }
        } else {
          if (t.column === 'verified') {
            nextColumn = 'progress';
            onAddLog('info', `KANBAN_TASKS: Rétrogradation de "${t.title}" vers [En Cours]`);
          } else if (t.column === 'progress') {
            nextColumn = 'todo';
            onAddLog('info', `KANBAN_TASKS: Rétrogradation de "${t.title}" vers [À Faire]`);
          }
        }
        
        // Update time descriptive tag based on state transition
        let nextTime = t.timeDetail;
        if (nextColumn === 'progress') {
          nextTime = `Started: Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else if (nextColumn === 'verified') {
          nextTime = `Completed: Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else {
          nextTime = 'Due: Today, 2:00 PM';
        }

        return { ...t, column: nextColumn, timeDetail: nextTime };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string, title: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    onAddLog('warn', `KANBAN_TASKS: Tâche supprimée du tableau opérationnel: "${title}"`);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      location: newTaskLoc.trim() || 'General Field',
      timeDetail: 'Due: Today, 2:00 PM',
      column: 'todo'
    };

    setTasks(prev => [...prev, newTask]);
    onAddLog('success', `KANBAN_TASKS: Nouvelle tâche opérationnelle créée : "${newTask.title}"`);
    setNewTaskTitle('');
    setNewTaskLoc('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md relative" id="agro-kanban-board-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître Task Board</span>
              <span className="text-[9px] bg-amber-50 text-[#BA5834] border border-orange-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Image 2: Kanban Ops Terminal</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Operational Scheduler & Shift Biometrics</p>
          </div>
        </div>

        {/* Worker Badge */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold font-mono block">LOGGED WORKER</span>
            <span className="text-xs font-bold text-stone-700">John D. (Operator)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#BA5834] text-white flex items-center justify-center font-bold text-xs select-none shadow">
            JD
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#451e09]">Operational Task Kanban Board</h1>
          <p className="text-[#6e5845] text-xs font-mono tracking-wide mt-0.5">
            DRAG & DROP SIMULATOR // ASSIGNMENTS SHARDS FOR PRECISE FIELD WORK
          </p>
        </div>

        <button 
          onClick={() => setShowAddForm(true)}
          className="px-3.5 py-1.5 bg-[#BA5834] hover:bg-[#a04321] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow select-none cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Kanban Column Layout - Grid of 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* COLUMN 1: TO DO */}
        <div className="bg-[#FAF9F5]/40 border border-stone-200 rounded-[24px] p-4 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center bg-[#FAF9F5] border border-stone-200/80 px-4 py-2.5 rounded-xl mb-4 font-bold text-sm text-[#451e09] shadow-xs select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BA5834]" />
              <span>To Do</span>
            </span>
            <span className="bg-[#BA5834]/10 text-[#BA5834] px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              {tasks.filter(t => t.column === 'todo').length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <AnimatePresence mode="popLayout">
              {tasks.filter(t => t.column === 'todo').map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className="bg-white hover:bg-stone-50 border border-stone-200/80 rounded-xl p-3 shadow-xs flex flex-col justify-between group transition relative"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="border-l-2 border-[#BA5834] pl-2.5 space-y-1">
                      <h4 className="text-xs font-bold text-stone-800 leading-tight">Task: {task.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>Location: {task.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                        <Calendar className="w-3 h-3 text-stone-300" />
                        <span>{task.timeDetail}</span>
                      </div>
                    </div>
                    <span className="text-xs p-1 select-none text-stone-300 group-hover:text-amber-600 transition">📦</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3.5 pt-2 border-t border-stone-100 flex justify-between items-center">
                    <button 
                      onClick={() => deleteTask(task.id, task.title)}
                      className="text-stone-300 hover:text-red-500 transition-colors duration-150 p-1 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveTask(task.id, 'next')}
                      className="text-[#BA5834] hover:text-[#451e09] font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer bg-amber-50 hover:bg-amber-100/50 px-2 py-0.5 rounded"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.filter(t => t.column === 'todo').length === 0 && (
              <div className="h-28 border border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-center text-xs text-stone-400 font-mono">
                No tickets left in schedule
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="bg-[#FAF9F5]/40 border border-stone-200 rounded-[24px] p-4 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center bg-[#FAF9F5] border border-stone-200/80 px-4 py-2.5 rounded-xl mb-4 font-bold text-sm text-amber-900 shadow-xs select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>In Progress</span>
            </span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              {tasks.filter(t => t.column === 'progress').length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <AnimatePresence mode="popLayout">
              {tasks.filter(t => t.column === 'progress').map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs flex flex-col justify-between group transition relative"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="border-l-2 border-amber-500 pl-2.5 space-y-1">
                      <h4 className="text-xs font-bold text-stone-800 leading-tight">Task: {task.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                        <MapPin className="w-3 h-3 text-amber-500/50" />
                        <span>Location: {task.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 font-mono font-semibold">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{task.timeDetail}</span>
                      </div>
                    </div>
                    <span className="text-xs p-1 select-none text-stone-300">⚙️</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3.5 pt-2 border-t border-stone-100 flex justify-between items-center gap-2">
                    <button
                      onClick={() => moveTask(task.id, 'prev')}
                      className="text-stone-400 hover:text-stone-700 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                      <span>Back</span>
                    </button>
                    
                    <button
                      onClick={() => moveTask(task.id, 'next')}
                      className="text-green-600 hover:text-green-800 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded"
                    >
                      <span>Complete</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.filter(t => t.column === 'progress').length === 0 && (
              <div className="h-28 border border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-center text-xs text-stone-400 font-mono">
                No operations running.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: VERIFIED */}
        <div className="bg-[#FAF9F5]/40 border border-stone-200 rounded-[24px] p-4 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center bg-[#FAF9F5] border border-stone-200/80 px-4 py-2.5 rounded-xl mb-4 font-bold text-sm text-emerald-800 shadow-xs select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Verified Result</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              {tasks.filter(t => t.column === 'verified').length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <AnimatePresence mode="popLayout">
              {tasks.filter(t => t.column === 'verified').map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className="bg-white hover:bg-emerald-50/20 border border-emerald-100 rounded-xl p-3 shadow-xs flex flex-col justify-between transition relative group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="border-l-2 border-emerald-500 pl-2.5 space-y-1">
                      <h4 className="text-xs font-bold text-stone-700 leading-tight">Task: {task.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                        <MapPin className="w-3 h-3 text-emerald-500/40" />
                        <span>Location: {task.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono font-medium">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{task.timeDetail}</span>
                      </div>
                    </div>
                    <span className="text-xs p-0.5 bg-emerald-50 rounded text-emerald-600 select-none">✓</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3.5 pt-2 border-t border-stone-100 flex justify-between items-center">
                    <button
                      onClick={() => moveTask(task.id, 'prev')}
                      className="text-stone-400 hover:text-stone-700 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                      <span>Revise</span>
                    </button>
                    
                    <span className="text-[9px] font-mono font-bold text-emerald-600">PASSED✓</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.filter(t => t.column === 'verified').length === 0 && (
              <div className="h-28 border border-dashed border-emerald-100 rounded-2xl flex items-center justify-center text-center text-xs text-stone-400 font-mono">
                No logs certified.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* FLOAT AREA RIGHT: QUICK CLOCK-IN BOX (High fidelity reproduction of image drop shadow glow!) */}
      <div className="flex justify-end pr-2 md:pr-4">
        <button
          onClick={handleClockToggle}
          style={{
            boxShadow: isClockedIn 
              ? '0 0 35px rgba(220, 38, 38, 0.45)' 
              : '0 0 30px rgba(186, 88, 52, 0.35)'
          }}
          className={`flex items-center gap-3 px-8 py-4.5 rounded-[22px] text-white font-serif font-bold text-base transition-all duration-300 hover:scale-103 cursor-pointer select-none active:scale-97 ${
            isClockedIn 
              ? 'bg-gradient-to-r from-red-600 to-red-700 border border-red-500/50' 
              : 'bg-gradient-to-r from-[#e3612d] to-[#BA5834] border border-[#e3612d]/50'
          }`}
          id="quick-clock-in-btn"
        >
          {isClockedIn ? (
            <>
              <Timer className="w-5 h-5 animate-pulse text-white-100" />
              <span>Active Log out ({formatTime(elapsedSeconds)})</span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 text-amber-100" />
              <span>Quick Clock-In</span>
            </>
          )}
        </button>
      </div>

      {/* Slideup Add Custom Task Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] border border-stone-200 p-6 max-w-sm w-full font-sans text-xs text-stone-700 shadow-xl"
            >
              <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                <span className="font-serif font-bold text-[#451e09] text-sm flex items-center gap-1.5">
                  📝 Schedule New Field Work
                </span>
                <button onClick={() => setShowAddForm(false)} className="hover:text-[#BA5834] text-stone-400 cursor-pointer">
                  Close ✕
                </button>
              </div>

              <form onSubmit={handleAddTaskSubmit} className="space-y-4">
                <div>
                  <label className="block text-stone-500 text-[10px] uppercase font-bold mb-1">Task Definition:</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Repair irrigation pipeline sector 3..."
                    className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-lg outline-none text-xs font-semibold focus:border-[#BA5834]"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 text-[10px] uppercase font-bold mb-1">Target Location:</label>
                  <input
                    type="text"
                    required
                    value={newTaskLoc}
                    onChange={(e) => setNewTaskLoc(e.target.value)}
                    placeholder="e.g. Field B, Plot 3..."
                    className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-lg outline-none text-xs font-semibold focus:border-[#BA5834]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-stone-150 hover:bg-stone-200 rounded-lg text-stone-600 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#BA5834] hover:bg-[#a04321] text-white rounded-lg font-bold transition shadow-sm"
                  >
                    Add to Backlog
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
