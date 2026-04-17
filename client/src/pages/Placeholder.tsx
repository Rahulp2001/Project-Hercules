import { Card } from '../components/ui/Card';

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{title}</h2>
      <Card>
        <p className="text-text-secondary">Coming soon.</p>
      </Card>
    </div>
  );
}
