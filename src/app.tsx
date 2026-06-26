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

// --- INITIAL MASTER DATA ---
const INITIAL_SCHOOLS = [
  { id: 'A3', code: 'A3', name: 'Sloan Lake' },
  { id: 'A4', code: 'A4', name: 'Midtown' },
  { id: 'A5', code: 'A5', name: 'Berkeley Park' },
  { id: 'A9', code: 'A9', name: 'My First Steps' },
  { id: 'A10', code: 'A10', name: 'Step Up' },
  { id: 'C1', code: 'C1', name: 'Cannon LC' },
];

const FOOD_CATALOG = [
  { id: 'f1', name: 'WG Pancakes 1 EA', mealType: 'Breakfast', servingSize: '1 EA', weightLbs: 0.15, maxWeightLbs: 2.5 },
  { id: 'f2', name: 'Peaches', mealType: 'Breakfast', servingSize: '1/2 CUP', weightLbs: 0.22, maxWeightLbs: 4.4 },
  { id: 'f3', name: 'Chili Beef and Bean', mealType: 'Lunch', servingSize: '1/2 CUP', weightLbs: 0.30, maxWeightLbs: 2.8 },
  { id: 'f4', name: 'Shredded Cheese', mealType: 'Lunch', servingSize: '1/8 CUP', weightLbs: 0.08, maxWeightLbs: 5.0 },
  { id: 'f5', name: 'Corn', mealType: 'Lunch', servingSize: '1/4 CUP', weightLbs: 0.10, maxWeightLbs: 3.5 },
  { id: 'f6', name: 'Animal Crackers', mealType: 'Snack', servingSize: '1/4 CUP', weightLbs: 0.06, maxWeightLbs: 1.5 },
  { id: 'f7', name: 'Apple Sauce', mealType: 'Snack', servingSize: '1/2 CUP', weightLbs: 0.28, maxWeightLbs: 5.0 },
  { id: 'f8', name: 'WG Rice Chex', mealType: 'Breakfast', servingSize: '3/4 CUP', weightLbs: 0.06, maxWeightLbs: 1.5 },
  { id: 'f9', name: 'Apple Slices', mealType: 'Breakfast', servingSize: '1/2 CUP', weightLbs: 0.22, maxWeightLbs: 4.4 },
  { id: 'f10', name: 'Chicken', mealType: 'Lunch', servingSize: '1/4 CUP', weightLbs: 0.10, maxWeightLbs: 3.0 },
  { id: 'f11', name: 'Broccoli', mealType: 'Lunch', servingSize: '1/4 CUP', weightLbs: 0.10, maxWeightLbs: 2.5 },
  { id: 'f12', name: 'Yogurt', mealType: 'Snack', servingSize: '1/4 CUP', weightLbs: 0.15, maxWeightLbs: 4.0 },
  { id: 'f13', name: 'WG Granola', mealType: 'Snack', servingSize: '1/8 CUP', weightLbs: 0.06, maxWeightLbs: 2.0 },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const INITIAL_TEMPLATES = [
  {
    id: 't1',
    name: 'Week 3 Menu',
    days: {
      Monday: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
      Tuesday: ['f8', 'f9', 'f10', 'f11', 'f12', 'f13'],
      Wednesday: [], Thursday: [], Friday: []
    }
  }
];

// --- GLOBAL STATE CONTEXT ---
const AppContext = createContext<any>(null);
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [schools, setSchools] = useState(() => JSON.parse(localStorage.getItem('ml_schools') || 'null') || INITIAL_SCHOOLS);
  const [foodCatalog, setFoodCatalog] = useState(() => JSON.parse(localStorage.getItem('ml_food') || 'null') || FOOD_CATALOG);
  const [templates, setTemplates] = useState(() => JSON.parse(localStorage.getItem('ml_templates') || 'null') || INITIAL_TEMPLATES);
  const [weeklyCounts, setWeeklyCounts] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_counts') || 'null') || {});
  const [weeklyMenuIds, setWeeklyMenuIds] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_menu') || 'null') || {});
  const [weeklyOverrides, setWeeklyOverrides] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_overrides') || 'null') || {});
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [weekDateRange, setWeekDateRange] = useState(() => localStorage.getItem('ml_week_date') || '');

  // Persistence
  useEffect(() => { localStorage.setItem('ml_schools', JSON.stringify(schools)); }, [schools]);
  useEffect(() => { localStorage.setItem('ml_food', JSON.stringify(foodCatalog)); }, [foodCatalog]);
  useEffect(() => { localStorage.setItem('ml_templates', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('ml_weekly_counts', JSON.stringify(weeklyCounts)); }, [weeklyCounts]);
  useEffect(() => { localStorage.setItem('ml_weekly_menu', JSON.stringify(weeklyMenuIds)); }, [weeklyMenuIds]);
  useEffect(() => { localStorage.setItem('ml_weekly_overrides', JSON.stringify(weeklyOverrides)); }, [weeklyOverrides]);
  useEffect(() => { localStorage.setItem('ml_week_date', weekDateRange); }, [weekDateRange]);

  const value = {
    schools, setSchools,
    foodCatalog, setFoodCatalog,
    templates, setTemplates,
    weeklyCounts, setWeeklyCounts,
    weeklyMenuIds, setWeeklyMenuIds,
    weeklyOverrides, setWeeklyOverrides,
    selectedDay, setSelectedDay,
    weekDateRange, setWeekDateRange
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- SHARED COMPONENTS ---
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

// --- TAB COMPONENTS ---

const FoodDatabaseTab = () => {
  const { foodCatalog, setFoodCatalog } = useAppContext();
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodMealType, setNewFoodMealType] = useState('Lunch');
  const [newFoodServingSize, setNewFoodServingSize] = useState('');
  const [newFoodWeight, setNewFoodWeight] = useState('');
  const [newFoodMaxWeight, setNewFoodMaxWeight] = useState('');

  const handleAddFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newFoodServingSize || !newFoodWeight || !newFoodMaxWeight) return;
    const newItem = {
      id: `f${Date.now()}`, 
      name: newFoodName, 
      mealType: newFoodMealType,
      servingSize: newFoodServingSize, 
      weightLbs: parseFloat(newFoodWeight), 
      maxWeightLbs: parseFloat(newFoodMaxWeight)
    };
    setFoodCatalog([...foodCatalog, newItem]);
    setNewFoodName(''); setNewFoodServingSize(''); setNewFoodWeight(''); setNewFoodMaxWeight('');
  };

  const handleDeleteFoodItem = (foodId: string) => {
    setFoodCatalog(foodCatalog.filter((f: any) => f.id !== foodId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Master Food Database</h2>
        <p className="text-gray-500 text-sm">Manage all available food items, serving sizes, and weight limits.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Serving Size</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Weight (lbs)</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Max/Bag (lbs)</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodCatalog.map((food: any) => (
              <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">{food.name}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{food.mealType}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{food.servingSize}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-900">{food.weightLbs.toFixed(2)}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-900">{food.maxWeightLbs.toFixed(2)}</td>
                <td className="px-6 py-3 whitespace-nowrap text-center">
                  <button onClick={() => handleDeleteFoodItem(food.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="px-4 py-3">
                <input type="text" placeholder="e.g. Apple Slices" value={newFoodName} onChange={e => setNewFoodName(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
              </td>
              <td className="px-4 py-3">
                <select value={newFoodMealType} onChange={e => setNewFoodMealType(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-white">
                  <option>Breakfast</option><option>Lunch</option><option>Snack</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <input type="text" placeholder="1/2 CUP" value={newFoodServingSize} onChange={e => setNewFoodServingSize(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
              </td>
              <td className="px-4 py-3">
                <input type="number" step="0.01" min="0.01" placeholder="0.22" value={newFoodWeight} onChange={e => setNewFoodWeight(e.target.value)} className="w-full text-center rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
              </td>
              <td className="px-4 py-3">
                <input type="number" step="0.01" min="0.1" placeholder="4.4" value={newFoodMaxWeight} onChange={e => setNewFoodMaxWeight(e.target.value)} className="w-full text-center rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
              </td>
              <td className="px-4 py-3 text-center">
                <button onClick={handleAddFoodItem} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors w-full flex justify-center">
                  <Plus size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RosterTab = () => {
  const { schools, setSchools, weeklyCounts, setWeeklyCounts, selectedDay } = useAppContext();
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');

  const dayCounts = weeklyCounts[selectedDay] || {};

  const handleCountChange = (schoolId: string, mealType: string, value: string) => {
    setWeeklyCounts((prev: any) => {
      const currentDayCounts = prev[selectedDay] || {};
      const schoolCounts = currentDayCounts[schoolId] || { Breakfast: '', Lunch: '', Snack: '' };
      return {
        ...prev,
        [selectedDay]: {
          ...currentDayCounts,
          [schoolId]: { ...schoolCounts, [mealType]: value === '' ? '' : parseInt(value, 10) }
        }
      };
    });
  };

  const handleAddSchool = () => {
    if (!newSchoolCode || !newSchoolName) return;
    const newSchool = { id: newSchoolCode.toUpperCase(), code: newSchoolCode.toUpperCase(), name: newSchoolName };
    setSchools([...schools, newSchool]);
    setNewSchoolCode(''); setNewSchoolName('');
  };

  const handleDeleteSchool = (schoolId: string) => {
    setSchools(schools.filter((s: any) => s.id !== schoolId));
  };

  const totals = schools.reduce((acc: any, school: any) => {
    const counts = dayCounts[school.id] || {};
    acc.Breakfast += (counts.Breakfast || 0);
    acc.Lunch += (counts.Lunch || 0);
    acc.Snack += (counts.Snack || 0);
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
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school: any) => {
              const counts = dayCounts[school.id] || {};
              return (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap font-bold text-gray-900">{school.code}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{school.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-blue-50/30">
                    <input type="number" min="0" value={counts.Breakfast || ''} onChange={(e) => handleCountChange(school.id, 'Breakfast', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-green-50/30">
                    <input type="number" min="0" value={counts.Lunch || ''} onChange={(e) => handleCountChange(school.id, 'Lunch', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-orange-50/30">
                    <input type="number" min="0" value={counts.Snack || ''} onChange={(e) => handleCountChange(school.id, 'Snack', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <button onClick={() => handleDeleteSchool(school.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="px-4 py-3">
                 <input type="text" placeholder="Code" value={newSchoolCode} onChange={e => setNewSchoolCode(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border uppercase" />
              </td>
              <td className="px-4 py-3" colSpan={4}>
                 <div className="flex gap-2">
                    <input type="text" placeholder="New School Name" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border" />
                 </div>
              </td>
              <td className="px-4 py-3 text-center">
                 <button onClick={handleAddSchool} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors w-full flex justify-center">
                    <Plus size={18} />
                 </button>
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-right">TOTALS:</td>
              <td className="px-6 py-4 text-center text-blue-900">{totals.Breakfast}</td>
              <td className="px-6 py-4 text-center text-green-900">{totals.Lunch}</td>
              <td className="px-6 py-4 text-center text-orange-900">{totals.Snack}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const TemplateBuilderTab = () => {
  const { templates, setTemplates, foodCatalog, selectedDay } = useAppContext();
  const [editingTemplateId, setEditingTemplateId] = useState(templates[0]?.id || '');
  const [newTemplateName, setNewTemplateName] = useState('');

  const activeTemplate = templates.find((t: any) => t.id === editingTemplateId);
  const dayMenuIds = activeTemplate ? (activeTemplate.days[selectedDay] || []) : [];

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName) return;
    const newTemplate = {
      id: `t${Date.now()}`, name: newTemplateName,
      days: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] }
    };
    setTemplates([...templates, newTemplate]);
    setEditingTemplateId(newTemplate.id);
    setNewTemplateName('');
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updated = templates.filter((t: any) => t.id !== templateId);
    setTemplates(updated);
    setEditingTemplateId(updated.length > 0 ? updated[0].id : '');
  };

  const addTemplateItem = (foodId: string) => {
    if (!foodId) return;
    setTemplates((prev: any[]) => prev.map(t => {
      if (t.id !== editingTemplateId) return t;
      const currentDays = t.days[selectedDay] || [];
      if (currentDays.includes(foodId)) return t;
      return { ...t, days: { ...t.days, [selectedDay]: [...currentDays, foodId] } };
    }));
  };

  const removeTemplateItem = (foodId: string) => {
    setTemplates((prev: any[]) => prev.map(t => {
      if (t.id !== editingTemplateId) return t;
      const currentDays = t.days[selectedDay] || [];
      return { ...t, days: { ...t.days, [selectedDay]: currentDays.filter((id: string) => id !== foodId) } };
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Menu Template Builder</h2>
        <p className="text-gray-500 text-sm">Create reusable weekly menus. Changes here do NOT affect the active week until applied.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
        <div className="flex-1">
          <label className="block text-xs font-bold text-purple-900 mb-1">Create New</label>
          <form onSubmit={handleCreateTemplate} className="flex gap-2">
            <input type="text" required value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)} placeholder="e.g. Week 4 Menu" className="flex-1 rounded-md sm:text-sm p-2 border border-purple-200" />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition"><Plus size={16}/></button>
          </form>
        </div>
        <div className="w-px bg-purple-200 hidden md:block"></div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-purple-900 mb-1">Edit Existing</label>
          <div className="flex gap-2 items-center">
            <select value={editingTemplateId} onChange={(e) => setEditingTemplateId(e.target.value)} className="flex-1 border-gray-300 bg-white rounded-md p-2 shadow-sm sm:text-sm border">
              {templates.length === 0 && <option value="">-- No Templates --</option>}
              {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {editingTemplateId && (
              <button onClick={() => handleDeleteTemplate(editingTemplateId)} className="text-red-600 hover:bg-red-50 p-2 rounded-md"><Trash2 size={18} /></button>
            )}
          </div>
        </div>
      </div>

      {activeTemplate && (
        <>
          <DaySelector />
          <div className="grid md:grid-cols-3 gap-6">
            {['Breakfast', 'Lunch', 'Snack'].map(mealType => {
              const allItemsOfType = foodCatalog.filter((f: any) => f.mealType === mealType);
              const selectedItems = allItemsOfType.filter((i: any) => dayMenuIds.includes(i.id));
              const unselectedItems = allItemsOfType.filter((i: any) => !dayMenuIds.includes(i.id));
              const colorClass = mealType === 'Breakfast' ? 'blue' : mealType === 'Lunch' ? 'green' : 'orange';
              
              return (
                <div key={mealType} className={`bg-white rounded-xl shadow-sm border-t-4 border-${colorClass}-500 flex flex-col h-[400px]`}>
                  <div className={`bg-${colorClass}-50 px-4 py-3 border-b border-${colorClass}-100 flex justify-between items-center shrink-0`}>
                    <h3 className={`font-bold text-${colorClass}-900`}>{mealType}</h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {selectedItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-2 rounded-lg group">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.servingSize}</div>
                        </div>
                        <button onClick={() => removeTemplateItem(item.id)} className="text-gray-400 hover:text-red-500 p-1"><X size={18} /></button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 border-t border-gray-100 shrink-0">
                    <select value="" onChange={(e) => addTemplateItem(e.target.value)} className={`w-full rounded-md border-gray-300 focus:border-${colorClass}-500 sm:text-sm p-2 border bg-white`}>
                      <option value="" disabled>+ Add {mealType} Item...</option>
                      {unselectedItems.map((item: any) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
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
  const { weeklyMenuIds, setWeeklyMenuIds, templates, foodCatalog, selectedDay } = useAppContext();
  const dayMenuIds = weeklyMenuIds[selectedDay] || [];

  const addMenuItem = (foodId: string) => {
    if (!foodId) return;
    setWeeklyMenuIds((prev: any) => {
      const dayMenu = prev[selectedDay] || [];
      if (dayMenu.includes(foodId)) return prev;
      return { ...prev, [selectedDay]: [...dayMenu, foodId] };
    });
  };

  const removeMenuItem = (foodId: string) => {
    setWeeklyMenuIds((prev: any) => {
      const dayMenu = prev[selectedDay] || [];
      return { ...prev, [selectedDay]: dayMenu.filter((id: string) => id !== foodId) };
    });
  };

  const applyTemplate = (template: any) => {
    if(window.confirm(`Apply ${template.name}? This will overwrite your active week's menu.`)) {
       setWeeklyMenuIds(template.days);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>
           <h3 className="font-bold text-blue-900 text-lg">Apply Prebuilt Template</h3>
           <p className="text-sm text-blue-700">Load a saved menu for the entire week.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {templates.map((t: any) => (
             <button 
               key={t.id} onClick={() => applyTemplate(t)}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-blue-700 transition"
             >
               Apply {t.name}
             </button>
          ))}
        </div>
      </div>

      <DaySelector />

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Active Menu Planner</h2>
        <p className="text-gray-500 text-sm">Select food items for <strong className="text-gray-900">{selectedDay}</strong>.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {['Breakfast', 'Lunch', 'Snack'].map(mealType => {
          const allItemsOfType = foodCatalog.filter((f: any) => f.mealType === mealType);
          const selectedItems = allItemsOfType.filter((i: any) => dayMenuIds.includes(i.id));
          const unselectedItems = allItemsOfType.filter((i: any) => !dayMenuIds.includes(i.id));
          const colorClass = mealType === 'Breakfast' ? 'blue' : mealType === 'Lunch' ? 'green' : 'orange';
          
          return (
            <div key={mealType} className={`bg-white rounded-xl shadow-sm border-t-4 border-${colorClass}-500 flex flex-col h-[400px]`}>
              <div className={`bg-${colorClass}-50 px-4 py-3 border-b border-${colorClass}-100 flex justify-between items-center shrink-0`}>
                <h3 className={`font-bold text-${colorClass}-900`}>{mealType}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-2 rounded-lg group">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.servingSize}</div>
                    </div>
                    <button onClick={() => removeMenuItem(item.id)} className="text-gray-400 hover:text-red-500 p-1"><X size={18} /></button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 border-t border-gray-100 shrink-0">
                <select value="" onChange={(e) => addMenuItem(e.target.value)} className={`w-full rounded-md border-gray-300 focus:border-${colorClass}-500 sm:text-sm p-2 border bg-white`}>
                  <option value="" disabled>+ Add {mealType} Item...</option>
                  {unselectedItems.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
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
  const dayMenuIds = weeklyMenuIds[selectedDay] || [];
  const dayOverrides = weeklyOverrides[selectedDay] || {};

  const handleOverrideChange = (schoolId: string, foodId: string, value: string) => {
    const key = `${schoolId}-${foodId}`;
    setWeeklyOverrides((prev: any) => {
      const overrides = { ...(prev[selectedDay] || {}) };
      if (value === '') delete overrides[key];
      else overrides[key] = parseInt(value, 10);
      return { ...prev, [selectedDay]: overrides };
    });
  };

  const rows: any[] = [];
  schools.forEach((school: any) => {
    const counts = dayCounts[school.id] || {};
    dayMenuIds.forEach((foodId: string) => {
      const item = foodCatalog.find((f: any) => f.id === foodId);
      if (!item || !counts[item.mealType] || counts[item.mealType] <= 0) return;
      rows.push({ school, item, count: counts[item.mealType] });
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DaySelector />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Review & Overrides</h2>
        <p className="text-gray-500 text-sm">Calculations combining your Roster Data and Active Menu for <strong className="text-gray-900">{selectedDay}</strong>.</p>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <Calculator className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">Nothing to calculate</h3>
          <p className="text-gray-500">Ensure you have entered Student Counts AND selected items in the Menu Planner.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu Item</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculated Weight</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Override Containers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map(({ school, item, count }) => {
                const totalWeight = (count * item.weightLbs).toFixed(2);
                const standardContainers = Math.ceil((count * item.weightLbs) / item.maxWeightLbs);
                const overrideKey = `${school.id}-${item.id}`;
                const currentOverride = dayOverrides[overrideKey];

                return (
                  <tr key={overrideKey} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{school.code}</div>
                      <div className="text-xs text-gray-500">{school.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.mealType} • {item.servingSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-gray-700">{count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{totalWeight} lbs</div>
                      <div className={`text-xs ${currentOverride ? "line-through text-gray-400" : "text-gray-500"}`}>
                        Standard: {standardContainers} containers
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <input 
                        type="number" min="1" placeholder="Auto" value={currentOverride || ''}
                        onChange={(e) => handleOverrideChange(school.id, item.id, e.target.value)}
                        className={`w-20 rounded-md shadow-sm sm:text-sm p-2 border bg-white ${currentOverride ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PrintTab = () => {
  const { schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, foodCatalog, weekDateRange, setWeekDateRange } = useAppContext();

  // Aggregate ALL DAYS of the week into a single print batch
  const generatedLabels = useMemo(() => {
    let labels: any[] = [];
    
    DAYS_OF_WEEK.forEach(day => {
      const dayCounts = weeklyCounts[day] || {};
      const dayMenuIds = weeklyMenuIds[day] || [];
      const dayOverrides = weeklyOverrides[day] || {};
      
      schools.forEach((school: any) => {
        const counts = dayCounts[school.id] || {};
        dayMenuIds.forEach((foodId: string) => {
          const item = foodCatalog.find((f: any) => f.id === foodId);
          if (!item) return;

          const studentCount = counts[item.mealType];
          if (!studentCount || studentCount <= 0) return;

          const totalWeight = studentCount * item.weightLbs;
          const overrideKey = `${school.id}-${item.id}`;
          let totalContainers = dayOverrides[overrideKey] || Math.ceil(totalWeight / item.maxWeightLbs);
          totalContainers = Math.max(1, totalContainers); 
          
          const weightPerContainer = (totalWeight / totalContainers).toFixed(2);

          for (let i = 1; i <= totalContainers; i++) {
            labels.push({
              id: `${school.id}-${item.id}-${i}-${day}`,
              schoolCode: school.code, schoolName: school.name,
              itemName: item.name, mealType: item.mealType,
              servingSize: item.servingSize, weight: weightPerContainer,
              currentContainer: i, totalContainers: totalContainers, day: day
            });
          }
        });
      });
    });
    return labels;
  }, [schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, foodCatalog]);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 no-print bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Print Weekly Batch</h2>
          <p className="text-gray-500 text-sm">You have <strong className="text-gray-900">{generatedLabels.length}</strong> labels queued for the entire week.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Print Date / Week Range</label>
             <input 
               type="text" 
               placeholder="e.g. 6/4 - 6/8" 
               value={weekDateRange} 
               onChange={(e) => setWeekDateRange(e.target.value)}
               className="w-40 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
             />
          </div>
          <button 
            onClick={() => window.print()} disabled={generatedLabels.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition h-[38px] mt-5"
          >
            <Printer size={18} /> Print All
          </button>
        </div>
      </div>

      {generatedLabels.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 no-print">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No labels to print</h3>
          <p className="text-gray-500">Ensure counts are entered and menu items are selected for at least one day this week.</p>
        </div>
      )}

      {/* PRINT SECTION */}
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
            <div key={label.id} className="avery-label border border-dashed border-gray-300 p-4 rounded flex flex-col justify-center items-center text-center relative overflow-hidden">
               <div className="font-bold text-sm uppercase mb-1">{label.schoolCode} {label.mealType}:{label.itemName}</div>
               <div className="flex gap-4 text-xs font-semibold mb-2">
                 <span>{label.servingSize}</span>
                 {/* This combines the day (e.g. MON) with their custom date input */}
                 <span className="uppercase text-gray-600">{label.day.substring(0,3)} {weekDateRange}</span>
               </div>
               <div className="flex justify-between w-full px-8 font-bold text-sm">
                 <span>{label.weight} LBS</span><span>{label.currentContainer}-{label.totalContainers}</span>
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
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-black tracking-tight text-blue-900 flex items-center gap-2">
            <CheckSquare className="text-blue-600" />
            KitchenLabel Pro
          </h1>
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
             <button 
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'database' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Database size={16} /> Database
            </button>
             <button 
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'templates' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <BookOpen size={16} /> Templates
            </button>
            <div className="w-px bg-gray-300 mx-1 shrink-0"></div>
            <button 
              onClick={() => setActiveTab('data-entry')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'data-entry' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ClipboardList size={16} /> 1. Roster
            </button>
            <button 
              onClick={() => setActiveTab('menu-planner')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'menu-planner' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Utensils size={16} /> 2. Menu
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'review' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Calculator size={16} /> 3. Review
            </button>
            <button 
              onClick={() => setActiveTab('print')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'print' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Printer size={16} /> 4. Print
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6 mt-2">
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
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}