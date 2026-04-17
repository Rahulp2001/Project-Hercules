import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { sleepApi, stepsApi, weightApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';

type Kind = 'sleep' | 'steps' | 'weight';

interface Props {
  open: boolean;
  kind: Kind;
  onClose: () => void;
  date: string;
  onSaved: () => void;
}

export function QuickLogger({ open, kind, onClose, date, onSaved }: Props) {
  const profileId = useProfileStore((s) => s.profileId);
  const [val, setVal] = useState('');
  const [val2, setVal2] = useState(''); // bedtime / wake
  const [val3, setVal3] = useState('');
  const [saving, setSaving] = useState(false);

  const titles: Record<Kind, string> = { sleep: 'Log Sleep', steps: 'Log Steps', weight: 'Log Weight' };

  const save = async () => {
    if (!profileId || !val) return;
    setSaving(true);
    try {
      if (kind === 'sleep') {
        await sleepApi.log({ profileId, date, hours: Number(val), bedtime: val2 || undefined, wakeTime: val3 || undefined });
      } else if (kind === 'steps') {
        await stepsApi.log(profileId, date, Number(val));
      } else {
        await weightApi.log(profileId, date, Number(val));
      }
      setVal(''); setVal2(''); setVal3('');
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={titles[kind]}>
      <div className="space-y-4">
        {kind === 'sleep' && (
          <>
            <Input label="Hours slept" type="number" placeholder="8" value={val} onChange={(e) => setVal(e.target.value)} />
            <Input label="Bedtime (optional)" type="time" value={val2} onChange={(e) => setVal2(e.target.value)} />
            <Input label="Wake time (optional)" type="time" value={val3} onChange={(e) => setVal3(e.target.value)} />
          </>
        )}
        {kind === 'steps' && (
          <Input label="Step count" type="number" placeholder="10000" value={val} onChange={(e) => setVal(e.target.value)} />
        )}
        {kind === 'weight' && (
          <Input label="Weight (kg)" type="number" placeholder="70" value={val} onChange={(e) => setVal(e.target.value)} />
        )}
        <Button onClick={save} disabled={saving || !val} className="w-full">
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Modal>
  );
}
