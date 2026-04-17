import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { AnimatedNumber } from '../ui/AnimatedNumber';

interface Props {
  consumed: number;
  burned: number;
  target: number;
  remaining: number;
}

export function CalorieRing({ consumed, burned, target, remaining }: Props) {
  return (
    <Card className="flex flex-col items-center">
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">Calories</h3>
      <ProgressRing
        value={consumed}
        max={target}
        label={String(Math.round(remaining))}
        sublabel="kcal left"
        color="#8b5cf6"
        animate
      />
      <div className="flex justify-between w-full mt-4 text-xs">
        <div className="text-center flex-1">
          <div className="text-text-muted">Consumed</div>
          <div className="font-bold text-text-primary"><AnimatedNumber value={Math.round(consumed)} /></div>
        </div>
        <div className="text-center flex-1">
          <div className="text-text-muted">Burned</div>
          <div className="font-bold text-brand-accent"><AnimatedNumber value={Math.round(burned)} /></div>
        </div>
        <div className="text-center flex-1">
          <div className="text-text-muted">Target</div>
          <div className="font-bold text-text-primary"><AnimatedNumber value={Math.round(target)} /></div>
        </div>
      </div>
    </Card>
  );
}
