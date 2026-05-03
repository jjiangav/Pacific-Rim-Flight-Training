import React, { useState, useEffect } from 'react';
import { checklists } from './checklists';

const FlightChecklist = () => {
  const [currentCategory, setCurrentCategory] = useState(Object.keys(checklists)[0]);
  const [selectedAircraft, setSelectedAircraft] = useState('C-GTWE');
  const [showPoster, setShowPoster] = useState(false);
  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('checklistProgress');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('checklistProgress', JSON.stringify(completedItems));
  }, [completedItems]);

  const toggleItem = (id) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    if (window.confirm("Reset all checklist progress?")) {
      setCompletedItems([]);
    }
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const allItems = Object.values(checklists).flat();
  const progressPercent = allItems.length > 0 ? Math.round((completedItems.length / allItems.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <header className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-sky-400">C172S Checklist</h1>
          <p className="text-slate-400 text-sm">Pacific Rim Aviation Academy</p>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
            className="bg-slate-800 text-sky-400 text-xs font-bold p-1 rounded border border-slate-700 outline-none"
          >
            <option value="C-GTWE">C-GTWE</option>
          </select>
          <button 
            onClick={() => setShowPoster(!showPoster)}
            className={`text-xs font-bold px-2 py-1 rounded transition-colors ${showPoster ? 'bg-sky-600 text-white' : 'bg-slate-800 text-sky-400'}`}
          >
            {showPoster ? 'VIEW COCKPIT' : 'VIEW POSTER'}
          </button>
          <button onClick={resetAll} className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors">
            CLEAR ALL
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {Object.keys(checklists).map(cat => (
          <button
            key={cat}
            onClick={() => setCurrentCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              currentCategory === cat ? 'bg-sky-600 shadow-lg shadow-sky-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* List */}
      <main className="space-y-2">
        {checklists[currentCategory].map((item) => (
          <div 
            key={item.id}
            className="space-y-2"
          >
            <div
            onClick={() => toggleItem(item.id)}
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              completedItems.includes(item.id) 
              ? 'bg-emerald-950/30 border-emerald-500/50' 
              : 'bg-slate-800 border-slate-700 hover:border-sky-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                completedItems.includes(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-sky-500'
              }`}>
                {completedItems.includes(item.id) && <span className="text-white text-xs">✓</span>}
              </div>
              <div>
                <p className={`font-medium ${completedItems.includes(item.id) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {item.task}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">{item.zone}</span>
              </div>
            </div>
            <span className={`font-mono text-sm font-bold ${completedItems.includes(item.id) ? 'text-emerald-500' : 'text-sky-400'}`}>
              {item.action}
            </span>
          </div>
          {/* Visual Aid Placeholder */}
          {!completedItems.includes(item.id) && (
            <div className="px-4 pb-2">
              <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-950 aspect-video group flex items-center justify-center">
                {!imageErrors[item.id] ? (
                  <img 
                    src={showPoster ? encodeURI(`${import.meta.env.BASE_URL}C172N Poster.Jpg`) : `${import.meta.env.BASE_URL}${selectedAircraft}.jpg`}
                    alt={`${selectedAircraft} ${showPoster ? 'Poster' : 'Cockpit'}`}
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div className="text-slate-500 text-xs text-center p-4">
                    <p className="font-bold">Image reference unavailable</p>
                    <p className="mt-1 opacity-70 italic">Check public folder for {selectedAircraft}.jpg</p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-bold text-sky-400">
                  ZONE: {item.zone}
                </div>
              </div>
            </div>
          )}
          </div>
        ))}
      </main>

      {/* Progress Bar */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400 uppercase tracking-tighter">Total Mission Completion</span>
            <span className="text-sky-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlightChecklist;