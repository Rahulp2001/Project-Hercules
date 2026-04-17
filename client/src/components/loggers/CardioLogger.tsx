import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cardioApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';

const TYPES = ['running', 'cycling', 'swimming', 'walking', 'jumprope', 'elliptical', 'other'];

interface Props {
  open: boolean;
  onClose: () => void;
  date: string;
  onSaved: () => void;
}

export function CardioLogger({ open, onClose, date, onSaved }: Props) {
  const profileId = useProfileStore((s) => s.profileId);
  const [activityType, setActivityType] = useState('running');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!profileId || !duration) return;
    setSaving(true);
    try {
      await cardioApi.create({
        profileId,
        date,
        activityType,
        duration: Number(duration),
        distance: distance ? Number(distance) : undefined,
      });
      setDuration(''); setDistance('');
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Cardio">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Activity</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActivityType(t)}
                className={`px-2 py-2 rounded-lg text-xs capitalize transition-all ${
                  activityType === t ? 'bg-brand-primary text-white shadow-glow' : 'bg-bg-elevated text-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Input label="Duration (min)" type="number" placeholder="30" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Input label="Distance (km, optional)" type="number" placeholder="5" value={distance} onChange={(e) => setDistance(e.target.value)} />
        <Button onClick={save} disabled={saving || !duration} className="w-full">
          {saving ? 'Saving...' : 'Save Cardio'}
        </Button>
      </div>
    </Modal>
  );
}
