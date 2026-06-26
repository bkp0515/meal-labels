import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { 
  Calculator, 
  Printer, 
  Plus, 
  Trash2, 
  AlertCircle,
  ClipboardList,
  Utensils,
  CheckSquare,
  BookOpen,
  X,
  Database
} from 'lucide-react';

// --- INITIAL MASTER DATA (v2 Grid Layout) ---
const INITIAL_SCHOOLS = [
  { id: 'A3', code: 'A3', name: 'Sloan Lake' },
  { id: 'A4', code: 'A4', name: 'Midtown' },
  { id: 'A5', code: 'A5', name: 'Berkeley Park' },
  { id: 'A9', code: 'A9', name: 'My First Steps' },
  { id: 'A10', code: 'A10', name: 'Step Up' },
  { id: 'C1', code: 'C1', name: 'Cannon LC' },
];

const CATEGORIES = ['Protein/Main', 'Vegetable', 'Fruit', 'Grain', 'Misc/Snack'];

const INITIAL_FOOD_CATALOG = [
  { 
    id: 'f1', name: 'WG Pancakes', category: 'Grain', maxPerContainer: 75,
    s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1
  },
  { 
    id: 'f2', name: 'Apple Slices', category: 'Fruit', maxPerContainer: 5.0,
    s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: ''
  },
  { 
    id: 'f3', name: 'Chili Beef and Bean', category: 'Protein/Main', maxPerContainer: 2.8,
    s_1_8: '', s_1_4: '', s_1_2: '0.30', s_3_4: '', ea_label: '', ea_value: ''
  },
  { 
    id: 'f4', name: 'Meatballs', category: 'Protein/Main', maxPerContainer: 100, // e.g. 25 portions * 4 ea = 100
    s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '4 Ea', ea_value: 4
  },
  { 
    id: 'f5', name: 'Broccoli', category: 'Vegetable', maxPerContainer: 2.5,
    s_1_8: '0.05', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: ''
  }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Helper to extract available sizes from a grid item
const getAvailableOptions = (food: any) => {
  const opts = [];
  if (food.s_1_8) opts.push({ key: `${food.id}|s_1_8`, food, sizeLabel: '1/8 cup', sizeValue: parseFloat(food.s_1_8), type: 'LBS' });
  if (food.s_1_4) opts.push({ key: `${food.id}|s_1_4`, food, sizeLabel: '1/4 cup', sizeValue: parseFloat(food.s_1_4), type: 'LBS' });
  if (food.s_1_2) opts.push({ key: `${food.id}|s_1_2`, food, sizeLabel: '1/2 cup', sizeValue: parseFloat(food.s_1_2), type: 'LBS' });
  if (food.s_3_4) opts.push({ key: `${food.id}|s_3_4`, food, sizeLabel: '3/4 cup', sizeValue: parseFloat(food.s_3_4), type: 'LBS' });
  if (food.ea_value) opts.push({ key: `${food.id}|ea`, food, sizeLabel: food.ea_label || 'EA', sizeValue: parseFloat(food.ea_value), type: 'EA' });
  return opts;
};

const AppContext = createContext<any>(null);
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Using v2 keys to force a clean slate from previous incompatible data formats
  const [schools, setSchools] = useState(() => JSON.parse(localStorage.getItem('ml_schools_v2') || 'null') || INITIAL_SCHOOLS);
  const [foodCatalog, setFoodCatalog] = useState(() => JSON.parse(localStorage.getItem('ml_food_v2') || 'null') || INITIAL_FOOD_CATALOG);
  const [templates, setTemplates] = useState(() => JSON.parse(localStorage.getItem('ml_templates_v2') || 'null') || []);
  const [weeklyCounts, setWeeklyCounts] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_counts_v2') || 'null') || {});
  const [weeklyMenuIds, setWeeklyMenuIds] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_menu_v2') || 'null') || {});
  const [weeklyOverrides, setWeeklyOverrides] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_overrides_v2') || 'null') || {});
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  // Date configuration for printing
  const getDefaultDate = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };
  const [weekStartDate, setWeekStartDate] = useState(() => localStorage.getItem('ml_week_start') || getDefaultDate());

  useEffect(() => { localStorage.setItem('ml_schools_v2', JSON.stringify(schools)); }, [schools]);
  useEffect(() => { localStorage.setItem('ml_food_v2', JSON.stringify(foodCatalog)); }, [foodCatalog]);
  useEffect(() => { localStorage.setItem('ml_templates_v2', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('ml_weekly_counts_v2', JSON.stringify(weeklyCounts)); }, [weeklyCounts]);
  useEffect(() => { localStorage.setItem('ml_weekly_menu_v2', JSON.stringify(weeklyMenuIds)); }, [weeklyMenuIds]);
  useEffect(() => { localStorage.setItem('ml_weekly_overrides_v2', JSON.stringify(weeklyOverrides)); }, [weeklyOverrides]);
  useEffect(() => { localStorage.setItem('ml_week_start', weekStartDate); }, [weekStartDate]);

  return (
    <AppContext.Provider value={{
      schools, setSchools, foodCatalog, setFoodCatalog,
      templates, setTemplates, weeklyCounts, setWeeklyCounts,
      weeklyMenuIds, setWeeklyMenuIds, weeklyOverrides, setWeeklyOverrides,
      selectedDay, setSelectedDay, weekStartDate, setWeekStartDate
    }}>
      {children}
    </AppContext.Provider>
  );
};

const DaySelector = () => {
  const { selectedDay, setSelectedDay } = useAppContext();
  return (
    <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-200 no-print">
      {DAYS_OF_WEEK.map(day => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            selectedDay === day 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

const AddItemDropdown = ({ onAdd, colorClass }: { onAdd: (key: string) => void, colorClass: string }) => {
  const { foodCatalog } = useAppContext();
  
  return (
    <select value="" onChange={(e) => onAdd(e.target.value)} className={`w-full rounded-md border-gray-300 focus:border-${colorClass}-500 sm:text-sm p-2 border bg-white shadow-sm`}>
      <option value="" disabled>+ Add Item...</option>
      {CATEGORIES.map(category => {
        const catFoods = foodCatalog.filter((f: any) => f.category === category);
        if (catFoods.length === 0) return null;
        
        return (
          <optgroup key={category} label={category}>
            {catFoods.map((food: any) => {
              const options = getAvailableOptions(food);
              return options.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {opt.food.name} - {opt.sizeLabel}
                </option>
              ));
            })}
          </optgroup>
        );
      })}
    </select>
  );
};

const RosterTab = () => {
  const { schools, setSchools, weeklyCounts, setWeeklyCounts, selectedDay } = useAppContext();
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');

  const dayCounts = weeklyCounts[selectedDay] || {};

  const handleCountChange = (schoolId: string, mealType: string, value: string) => {
    setWeeklyCounts((prev: any) => {
      const currentDay = prev[selectedDay] || {};
      const schoolCounts = currentDay[schoolId] || { Breakfast: '', Lunch: '', Snack: '' };
      return {
        ...prev,
        [selectedDay]: {
          ...currentDay,
          [schoolId]: { ...schoolCounts, [mealType]: value === '' ? '' : parseInt(value, 10) }
        }
      };
    });
  };

  const handleAddSchool = () => {
    if (!newSchoolCode || !newSchoolName) return;
    setSchools([...schools, { id: newSchoolCode.toUpperCase(), code: newSchoolCode.toUpperCase(), name: newSchoolName }]);
    setNewSchoolCode(''); setNewSchoolName('');
  };

  const totals = schools.reduce((acc: any, school: any) => {
    const counts = dayCounts[school.id] || {};
    acc.Breakfast += (counts.Breakfast || 0); acc.Lunch += (counts.Lunch || 0); acc.Snack += (counts.Snack || 0);
    return acc;
  }, { Breakfast: 0, Lunch: 0, Snack: 0 });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <DaySelector />
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Roster Input</h2>
          <p className="text-gray-500 text-sm">Entering counts for <strong className="text-gray-900">{selectedDay}</strong></p>
        </div>
        <button onClick={() => setWeeklyCounts({})} className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition">
          Clear Entire Week
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-blue-900">Breakfast</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-green-900">Lunch</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-orange-900">Snack</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school: any) => {
              const counts = dayCounts[school.id] || {};
              return (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSchools(schools.filter((s: any) => s.id !== school.id))} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                      <span className="font-bold text-gray-900">{school.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{school.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-blue-50/30">
                    <input type="number" min="0" value={counts.Breakfast || ''} onChange={(e) => handleCountChange(school.id, 'Breakfast', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-green-50/30">
                    <input type="number" min="0" value={counts.Lunch || ''} onChange={(e) => handleCountChange(school.id, 'Lunch', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-orange-50/30">
                    <input type="number" min="0" value={counts.Snack || ''} onChange={(e) => handleCountChange(school.id, 'Snack', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-white" />
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="px-4 py-3"><input type="text" placeholder="Code" value={newSchoolCode} onChange={e => setNewSchoolCode(e.target.value)} className="w-full rounded-md shadow-sm sm:text-sm p-2 border uppercase" /></td>
              <td className="px-4 py-3" colSpan={3}><input type="text" placeholder="New School Name" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="w-full rounded-md shadow-sm sm:text-sm p-2 border" /></td>
              <td className="px-4 py-3 text-center"><button onClick={handleAddSchool} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors w-full flex justify-center"><Plus size={18} /></button></td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-right">TOTALS:</td>
              <td className="px-6 py-4 text-center text-blue-900">{totals.Breakfast}</td>
              <td className="px-6 py-4 text-center text-green-900">{totals.Lunch}</td>
              <td className="px-6 py-4 text-center text-orange-900">{totals.Snack}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const FoodDatabaseTab = () => {
  const { foodCatalog, setFoodCatalog } = useAppContext();
  
  // New Item State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [max, setMax] = useState('');
  const [s18, setS18] = useState('');
  const [s14, setS14] = useState('');
  const [s12, setS12] = useState('');
  const [s34, setS34] = useState('');
  const [eaLbl, setEaLbl] = useState('');
  const [eaVal, setEaVal] = useState('');

  const handleAdd = () => {
    if (!name || !max) return;
    setFoodCatalog([...foodCatalog, {
      id: `f${Date.now()}`, name, category, maxPerContainer: parseFloat(max),
      s_1_8: s18, s_1_4: s14, s_1_2: s12, s_3_4: s34,
      ea_label: eaLbl, ea_value: eaVal ? parseFloat(eaVal) : null
    }]);
    setName(''); setMax(''); setS18(''); setS14(''); setS12(''); setS34(''); setEaLbl(''); setEaVal('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Master Food Database</h2>
        <p className="text-gray-500 text-sm">Define exact weights for standard serving sizes. Leave cells blank if that size isn't offered.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">Product Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">Category</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider bg-red-900" title="Max Per Bag (LBS or EA)">Max/Bag</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/8 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/4 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/2 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">3/4 cup</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider bg-purple-900" colSpan={2}>EA (Count)</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodCatalog.map((food: any) => (
              <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{food.name}</td>
                <td className="px-4 py-3 text-gray-600">{food.category}</td>
                <td className="px-2 py-3 text-center font-bold text-red-700">{food.maxPerContainer}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_8 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_4 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_2 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_3_4 || '-'}</td>
                <td className="px-2 py-3 text-right text-gray-600">{food.ea_label || '-'}</td>
                <td className="px-2 py-3 text-left text-gray-600">{food.ea_value ? `(${food.ea_value})` : ''}</td>
                <td className="px-2 py-3 text-center">
                  <button onClick={() => setFoodCatalog(foodCatalog.filter((f:any) => f.id !== food.id))} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="p-2"><input type="text" placeholder="New Item" value={name} onChange={e=>setName(e.target.value)} className="w-full p-1 border rounded" /></td>
              <td className="p-2">
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-1 border rounded bg-white">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </td>
              <td className="p-2"><input type="number" step="0.1" placeholder="Max" value={max} onChange={e=>setMax(e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s18} onChange={e=>setS18(e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s14} onChange={e=>setS14(e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s12} onChange={e=>setS12(e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s34} onChange={e=>setS34(e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
              <td className="p-2"><input type="text" placeholder="e.g. 4 Ea" value={eaLbl} onChange={e=>setEaLbl(e.target.value)} className="w-20 p-1 border rounded" /></td>
              <td className="p-2"><input type="number" placeholder="Qty" value={eaVal} onChange={e=>setEaVal(e.target.value)} className="w-12 p-1 border rounded text-center" /></td>
              <td className="p-2 text-center"><button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded w-full flex justify-center"><Plus size={16}/></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TemplateBuilderTab = () => {
  const { templates, setTemplates, foodCatalog, selectedDay } = useAppContext();
  const [editingId, setEditingId] = useState('');
  const [newName, setNewName] = useState('');

  const activeTemplate = templates.find((t: any) => t.id === editingId);
  const dayMenuKeys = activeTemplate ? (activeTemplate.days[selectedDay] || []) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault(); if (!newName) return;
    const nt = { id: `t${Date.now()}`, name: newName, days: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] } };
    setTemplates([...templates, nt]); setEditingId(nt.id); setNewName('');
  };

  const addItem = (key: string) => {
    setTemplates((prev: any[]) => prev.map(t => {
      if (t.id !== editingId) return t;
      const current = t.days[selectedDay] || [];
      if (current.includes(key)) return t;
      return { ...t, days: { ...t.days, [selectedDay]: [...current, key] } };
    }));
  };

  const removeItem = (key: string) => {
    setTemplates((prev: any[]) => prev.map(t => {
      if (t.id !== editingId) return t;
      return { ...t, days: { ...t.days, [selectedDay]: (t.days[selectedDay] || []).filter((k: string) => k !== key) } };
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Template Builder</h2>
        <p className="text-gray-500 text-sm">Build multi-day menus. Changes here do NOT affect the active week until applied.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
        <div className="flex-1">
          <label className="block text-xs font-bold text-purple-900 mb-1">Create New</label>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Template Name" className="flex-1 rounded-md sm:text-sm p-2 border" />
            <button type="submit" className="bg-purple-600 text-white px-3 py-2 rounded-md"><Plus size={16}/></button>
          </form>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-purple-900 mb-1">Edit Existing</label>
          <select value={editingId} onChange={e=>setEditingId(e.target.value)} className="w-full border-gray-300 bg-white rounded-md p-2 shadow-sm sm:text-sm border">
            <option value="">-- Select Template --</option>
            {templates.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {activeTemplate && (
        <>
          <DaySelector />
          <div className="grid md:grid-cols-3 gap-6">
            {['Breakfast', 'Lunch', 'Snack'].map(meal => {
              const colorClass = meal === 'Breakfast' ? 'blue' : meal === 'Lunch' ? 'green' : 'orange';
              // Filter keys by meal type. For display, we parse the key back into food info.
              const mealKeys = dayMenuKeys.filter((k: string) => k.includes(`|`)); // simplistic
              
              return (
                <div key={meal} className={`bg-white rounded-xl shadow-sm border-t-4 border-${colorClass}-500 flex flex-col h-[400px]`}>
                  <div className={`bg-${colorClass}-50 px-4 py-3 border-b border-${colorClass}-100 flex justify-between`}>
                    <h3 className={`font-bold text-${colorClass}-900`}>{meal}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {dayMenuKeys.map((key: string) => {
                      const [fId, sKey] = key.split('|');
                      const food = foodCatalog.find((f:any) => f.id === fId);
                      if (!food) return null;
                      const sizeLabel = sKey === 'ea' ? food.ea_label : sKey.replace('s_', '').replace('_', '/') + ' cup';
                      
                      return (
                        <div key={key} className="flex justify-between items-center bg-gray-50 border p-2 rounded-lg group">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{food.name}</div>
                            <div className="text-xs text-gray-500">{sizeLabel} • Max {food.maxPerContainer}</div>
                          </div>
                          <button onClick={() => removeItem(key)} className="text-gray-400 hover:text-red-500 p-1"><X size={18} /></button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-50 p-3 border-t border-gray-100 shrink-0">
                    <AddItemDropdown onAdd={addItem} colorClass={colorClass} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const MenuPlannerTab = () => {
  const { templates, weeklyMenuIds, setWeeklyMenuIds, foodCatalog, selectedDay } = useAppContext();
  const dayMenuKeys = weeklyMenuIds[selectedDay] || [];

  const addItem = (key: string) => {
    setWeeklyMenuIds((prev: any) => {
      const current = prev[selectedDay] || [];
      if (current.includes(key)) return prev;
      return { ...prev, [selectedDay]: [...current, key] };
    });
  };

  const removeItem = (key: string) => {
    setWeeklyMenuIds((prev: any) => ({
      ...prev, [selectedDay]: (prev[selectedDay] || []).filter((k: string) => k !== key)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div><h3 className="font-bold text-blue-900 text-lg">Apply Prebuilt Template</h3></div>
        <div className="flex flex-wrap gap-2 items-center">
          {templates.map((t: any) => (
             <button key={t.id} onClick={() => setWeeklyMenuIds(t.days)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-blue-700 transition">
               Apply {t.name}
             </button>
          ))}
        </div>
      </div>

      <DaySelector />

      <div className="grid md:grid-cols-3 gap-6">
        {['Breakfast', 'Lunch', 'Snack'].map(meal => {
          const colorClass = meal === 'Breakfast' ? 'blue' : meal === 'Lunch' ? 'green' : 'orange';
          return (
            <div key={meal} className={`bg-white rounded-xl shadow-sm border-t-4 border-${colorClass}-500 flex flex-col h-[400px]`}>
              <div className={`bg-${colorClass}-50 px-4 py-3 border-b border-${colorClass}-100 flex justify-between`}>
                <h3 className={`font-bold text-${colorClass}-900`}>{meal}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {dayMenuKeys.map((key: string) => {
                  const [fId, sKey] = key.split('|');
                  const food = foodCatalog.find((f:any) => f.id === fId);
                  if (!food) return null;
                  const sizeLabel = sKey === 'ea' ? food.ea_label : sKey.replace('s_', '').replace('_', '/') + ' cup';
                  
                  return (
                    <div key={key} className="flex justify-between items-center bg-gray-50 border p-2 rounded-lg group">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{food.name}</div>
                        <div className="text-xs text-gray-500">{sizeLabel} • Max {food.maxPerContainer}</div>
                      </div>
                      <button onClick={() => removeItem(key)} className="text-gray-400 hover:text-red-500 p-1"><X size={18} /></button>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 p-3 border-t border-gray-100 shrink-0">
                <AddItemDropdown onAdd={addItem} colorClass={colorClass} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewTab = () => {
  const { schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, setWeeklyOverrides, foodCatalog, selectedDay } = useAppContext();
  const dayCounts = weeklyCounts[selectedDay] || {};
  const dayMenuKeys = weeklyMenuIds[selectedDay] || [];
  const dayOverrides = weeklyOverrides[selectedDay] || {};

  const handleOverride = (schoolId: string, itemKey: string, value: string) => {
    const key = `${schoolId}-${itemKey}`;
    setWeeklyOverrides((prev: any) => {
      const overrides = { ...(prev[selectedDay] || {}) };
      if (value === '') delete overrides[key]; else overrides[key] = parseInt(value, 10);
      return { ...prev, [selectedDay]: overrides };
    });
  };

  const rows: any[] = [];
  schools.forEach((school: any) => {
    const counts = dayCounts[school.id] || {};
    
    // Group keys into meals conceptually based on what the user inputted in the roster
    // For review, we'll just check if the school has > 0 students for ANY meal, and render their assigned menu items.
    // In a more complex app, Menu items would be strictly assigned to a meal slot. For now, we apply the highest student count.
    const maxStudents = Math.max(counts.Breakfast || 0, counts.Lunch || 0, counts.Snack || 0);
    if (maxStudents <= 0) return;

    dayMenuKeys.forEach((menuKey: string) => {
      const [fId, sKey] = menuKey.split('|');
      const item = foodCatalog.find((f: any) => f.id === fId);
      if (!item) return;

      const sizeValue = sKey === 'ea' ? item.ea_value : item[sKey];
      if (!sizeValue) return;

      const sizeLabel = sKey === 'ea' ? item.ea_label : sKey.replace('s_', '').replace('_', '/') + ' cup';
      const isEa = sKey === 'ea';
      
      rows.push({ school, itemKey: menuKey, itemName: item.name, sizeLabel, sizeValue: parseFloat(sizeValue), max: item.maxPerContainer, isEa, count: maxStudents });
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DaySelector />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Menu Item</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Est. Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calculated Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Override Containers</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(r => {
              const rawTotal = r.count * r.sizeValue;
              const displayTotal = r.isEa ? `${Math.ceil(rawTotal)} EA` : `${rawTotal.toFixed(2)} LBS`;
              const stdContainers = Math.ceil(rawTotal / r.max);
              const overrideKey = `${r.school.id}-${r.itemKey}`;
              const currentOverride = dayOverrides[overrideKey];

              return (
                <tr key={overrideKey}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="font-bold text-gray-900">{r.school.code}</div><div className="text-xs text-gray-500">{r.school.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">{r.itemName}</div><div className="text-xs text-gray-500">{r.sizeLabel}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-gray-700">{r.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm">{displayTotal}</div><div className="text-xs text-gray-500">Standard: {stdContainers} bags</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <input type="number" min="1" placeholder="Auto" value={currentOverride || ''} onChange={(e) => handleOverride(r.school.id, r.itemKey, e.target.value)} className="w-20 rounded-md shadow-sm sm:text-sm p-2 border" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PrintTab = () => {
  const { schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, foodCatalog, weekStartDate, setWeekStartDate } = useAppContext();

  // Helper to format date "MM/DD" based on Monday's start date
  const getDateStringForDay = (dayIndex: number) => {
    if (!weekStartDate) return '';
    const date = new Date(weekStartDate + 'T12:00:00'); // Force noon to avoid timezone shift
    date.setDate(date.getDate() + dayIndex);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const generatedLabels = useMemo(() => {
    let labels: any[] = [];
    
    DAYS_OF_WEEK.forEach((day, index) => {
      const dateStr = getDateStringForDay(index);
      const dayCounts = weeklyCounts[day] || {};
      const dayMenuKeys = weeklyMenuIds[day] || [];
      const dayOverrides = weeklyOverrides[day] || {};
      
      schools.forEach((school: any) => {
        const counts = dayCounts[school.id] || {};
        const maxStudents = Math.max(counts.Breakfast || 0, counts.Lunch || 0, counts.Snack || 0);
        if (maxStudents <= 0) return;

        dayMenuKeys.forEach((menuKey: string) => {
          const [fId, sKey] = menuKey.split('|');
          const item = foodCatalog.find((f: any) => f.id === fId);
          if (!item) return;

          const sizeValue = sKey === 'ea' ? item.ea_value : item[sKey];
          if (!sizeValue) return;

          const isEa = sKey === 'ea';
          const sizeLabel = isEa ? item.ea_label : sKey.replace('s_', '').replace('_', '/') + ' cup';
          const totalRaw = maxStudents * parseFloat(sizeValue);
          const max = item.maxPerContainer;
          
          const overrideKey = `${school.id}-${menuKey}`;
          let totalContainers = dayOverrides[overrideKey] || Math.ceil(totalRaw / max);
          totalContainers = Math.max(1, totalContainers); 
          
          const valuePerContainer = (totalRaw / totalContainers);
          const displayValue = isEa ? Math.ceil(valuePerContainer) + ' EA' : valuePerContainer.toFixed(2) + ' LBS';

          for (let i = 1; i <= totalContainers; i++) {
            labels.push({
              id: `${school.id}-${menuKey}-${i}-${day}`,
              schoolCode: school.code, schoolName: school.name,
              itemName: item.name, servingSize: sizeLabel, 
              totalUnit: displayValue, dateStr, dayName: day.substring(0,3),
              currentContainer: i, totalContainers: totalContainers
            });
          }
        });
      });
    });
    return labels;
  }, [schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, foodCatalog, weekStartDate]);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 no-print bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Print Weekly Batch</h2>
          <p className="text-gray-500 text-sm">Generating labels for the entire week.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Week Of (Monday)</label>
             <input type="date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} className="w-40 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
          </div>
          <button onClick={() => window.print()} disabled={generatedLabels.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 mt-5">
            <Printer size={18} /> Print {generatedLabels.length} Labels
          </button>
        </div>
      </div>

      <div id="print-section" className="bg-white shadow-lg p-8 rounded-lg max-w-4xl mx-auto print:shadow-none print:p-0 print:max-w-none">
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #print-section, #print-section * { visibility: visible; }
              #print-section { position: absolute; left: 0; top: 0; width: 100%; }
              .no-print { display: none !important; }
              @page { size: letter; margin: 0.5in 0.15in; }
              .avery-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 0 !important; }
              .avery-label { width: 4in; height: 2in; padding: 0.25in; page-break-inside: avoid; border: none !important; }
            }
          `}
        </style>
        <div className="avery-grid grid grid-cols-2 gap-4">
          {generatedLabels.map((label) => (
            <div key={label.id} className="avery-label border border-dashed border-gray-400 p-4 rounded flex flex-col justify-center items-center text-center">
               <div className="font-black text-sm uppercase mb-1">{label.schoolCode}: {label.itemName}</div>
               <div className="flex gap-4 text-xs font-bold mb-2">
                 <span>{label.servingSize}</span>
                 <span className="uppercase text-gray-700">{label.dayName} {label.dateStr}</span>
               </div>
               <div className="flex justify-between w-full px-8 font-black text-sm">
                 <span>{label.totalUnit}</span><span>{label.currentContainer} of {label.totalContainers}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('data-entry');

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-12">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm no-print sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-black tracking-tight text-blue-900 flex items-center gap-2">
            <CheckSquare className="text-blue-600" /> KitchenLabel Pro
          </h1>
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
            <button onClick={() => setActiveTab('database')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${activeTab === 'database' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Database size={16} /> Database</button>
            <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${activeTab === 'templates' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><BookOpen size={16} /> Templates</button>
            <div className="w-px bg-gray-300 mx-1 shrink-0"></div>
            <button onClick={() => setActiveTab('data-entry')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${activeTab === 'data-entry' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><ClipboardList size={16} /> 1. Roster</button>
            <button onClick={() => setActiveTab('menu-planner')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${activeTab === 'menu-planner' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Utensils size={16} /> 2. Menu</button>
            <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${activeTab === 'review' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Calculator size={16} /> 3. Review</button>
            <button onClick={() => setActiveTab('print')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${activeTab === 'print' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Printer size={16} /> 4. Print</button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6 mt-2">
        {activeTab === 'database' && <FoodDatabaseTab />}
        {activeTab === 'templates' && <TemplateBuilderTab />}
        {activeTab === 'data-entry' && <RosterTab />}
        {activeTab === 'menu-planner' && <MenuPlannerTab />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'print' && <PrintTab />}
      </main>
    </div>
  );
};

export default function App() {
  return <AppProvider><MainLayout /></AppProvider>;
}