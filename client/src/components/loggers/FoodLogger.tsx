import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { mealsApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';
import { searchFoods, calcNutrition, type FoodItem } from '../../data/foods';

type Category = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface Props {
  open: boolean;
  onClose: () => void;
  date: string;
  onSaved: () => void;
  defaultCategory?: Category;
}

export function FoodLogger({ open, onClose, date, onSaved, defaultCategory }: Props) {
  const profileId = useProfileStore((s) => s.profileId);
  const [category, setCategory] = useState<Category>(defaultCategory ?? 'breakfast');

  useEffect(() => {
    if (defaultCategory && open) setCategory(defaultCategory);
  }, [defaultCategory, open]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'search' | 'manual'>('search');

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults(searchFoods(q));
    setSelected(null);
  };

  const selectFood = (food: FoodItem) => {
    setSelected(food);
    setName(food.name);
    setQuantity(String(food.serving));
    const n = calcNutrition(food, food.serving);
    setCalories(String(n.calories));
    setProtein(String(n.protein));
    setCarbs(String(n.carbs));
    setFats(String(n.fats));
    setResults([]);
    setQuery(food.name);
  };

  const handleQuantityChange = (q: string) => {
    setQuantity(q);
    if (selected && Number(q) > 0) {
      const n = calcNutrition(selected, Number(q));
      setCalories(String(n.calories));
      setProtein(String(n.protein));
      setCarbs(String(n.carbs));
      setFats(String(n.fats));
    }
  };

  const reset = () => {
    setQuery(''); setResults([]); setSelected(null); setQuantity('');
    setName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
  };

  const save = async () => {
    if (!profileId || !name.trim() || !calories) return;
    setSaving(true);
    try {
      await mealsApi.create({
        profileId, date, category,
        name: name.trim(),
        calories: Number(calories),
        protein: Number(protein || 0),
        carbs: Number(carbs || 0),
        fats: Number(fats || 0),
      });
      reset();
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Food">
      <div className="space-y-4">
        {/* Meal category */}
        <div>
          <label className="block text-sm text-text-secondary mb-2">Meal</label>
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snacks'] as Category[]).map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`py-2 rounded-lg text-xs capitalize transition-all ${category === c ? 'bg-brand-primary text-white shadow-glow' : 'bg-bg-elevated text-text-secondary'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button onClick={() => setMode('search')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'search' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-bg-elevated text-text-secondary'}`}>
            Search Database
          </button>
          <button onClick={() => setMode('manual')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'manual' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-bg-elevated text-text-secondary'}`}>
            Enter Manually
          </button>
        </div>

        {mode === 'search' && (
          <>
            {/* Search box */}
            <div className="relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  className="input pl-9"
                  placeholder="Search foods... (e.g. chicken breast)"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-bg-card rounded-xl border border-white/10 overflow-hidden shadow-xl">
                  {results.map((f) => (
                    <button key={f.name} onClick={() => selectFood(f)}
                      className="w-full text-left px-4 py-3 hover:bg-bg-elevated transition-colors flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{f.name}</div>
                        <div className="text-xs text-text-muted">{f.category} · per {f.serving}{f.unit}</div>
                      </div>
                      <div className="text-xs text-brand-primary font-bold">{f.calories} kcal</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Quantity ({selected.unit})
                </label>
                <input
                  className="input"
                  type="number"
                  placeholder={String(selected.serving)}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {mode === 'manual' && (
          <Input label="Food name" placeholder="e.g. Home cooked dal rice" value={name}
            onChange={(e) => setName(e.target.value)} />
        )}

        {/* Nutrition fields — shown once food selected or in manual mode */}
        {(selected || mode === 'manual') && (
          <>
            <Input label="Calories (kcal)" type="number" value={calories}
              onChange={(e) => setCalories(e.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              <Input label="Protein (g)" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
              <Input label="Carbs (g)" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
              <Input label="Fats (g)" type="number" value={fats} onChange={(e) => setFats(e.target.value)} />
            </div>
          </>
        )}

        <Button onClick={save} disabled={saving || !name.trim() || !calories} className="w-full">
          {saving ? 'Saving...' : 'Save Meal'}
        </Button>
      </div>
    </Modal>
  );
}
