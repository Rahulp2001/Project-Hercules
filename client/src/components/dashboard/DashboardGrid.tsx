import { useState, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export type WidgetSize = 'full' | 'half';

export interface WidgetDef {
  id: string;
  label: string;
  defaultSize?: WidgetSize;
  node: React.ReactNode;
}

interface Props {
  widgets: WidgetDef[];
  storageKey: string;
}

function SortableWidget({
  id,
  label,
  node,
  size,
  onToggleSize,
  isDragOverlay,
}: WidgetDef & { size: WidgetSize; onToggleSize: () => void; isDragOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    gridColumn: size === 'full' ? 'span 2 / span 2' : 'span 1 / span 1',
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group min-w-0">
      <motion.div variants={itemVariants}>
        {/* Toolbar: drag + resize */}
        <div
          className={`absolute top-2 right-2 z-20 flex items-center gap-1 transition-opacity ${isDragOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
        >
          <button
            onClick={onToggleSize}
            className="p-1.5 rounded-lg bg-bg-elevated/80 backdrop-blur text-text-muted hover:text-brand-primary hover:bg-bg-elevated transition-all"
            title={size === 'full' ? 'Make half-width' : 'Make full-width'}
          >
            {size === 'full' ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <div
            {...attributes}
            {...listeners}
            className="p-1.5 rounded-lg bg-bg-elevated/80 backdrop-blur text-text-muted hover:text-brand-primary hover:bg-bg-elevated transition-all cursor-grab active:cursor-grabbing"
            title={`Drag to reorder ${label}`}
          >
            <GripVertical size={13} />
          </div>
        </div>
        {node}
      </motion.div>
    </div>
  );
}

export function DashboardGrid({ widgets: initialWidgets, storageKey }: Props) {
  const sizeKey = `${storageKey}-sizes`;

  const [order, setOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const ids = initialWidgets.map((w) => w.id);
        if (parsed.every((id) => ids.includes(id)) && ids.every((id) => parsed.includes(id))) {
          return parsed;
        }
      }
    } catch { }
    return initialWidgets.map((w) => w.id);
  });

  const [sizes, setSizes] = useState<Record<string, WidgetSize>>(() => {
    const defaults: Record<string, WidgetSize> = {};
    initialWidgets.forEach((w) => { defaults[w.id] = w.defaultSize ?? 'full'; });
    try {
      const saved = localStorage.getItem(sizeKey);
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch { }
    return defaults;
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const sorted = order
    .map((id) => initialWidgets.find((w) => w.id === id))
    .filter(Boolean) as WidgetDef[];

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      setOrder((prev) => {
        const oldIdx = prev.indexOf(String(active.id));
        const newIdx = prev.indexOf(String(over.id));
        const next = arrayMove(prev, oldIdx, newIdx);
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  const toggleSize = useCallback(
    (id: string) => {
      setSizes((prev) => {
        const next: Record<string, WidgetSize> = { ...prev, [id]: prev[id] === 'full' ? 'half' : 'full' };
        localStorage.setItem(sizeKey, JSON.stringify(next));
        return next;
      });
    },
    [sizeKey]
  );

  const activeWidget = activeId ? initialWidgets.find((w) => w.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {sorted.map((widget) => (
            <SortableWidget
              key={widget.id}
              {...widget}
              size={sizes[widget.id] ?? 'full'}
              onToggleSize={() => toggleSize(widget.id)}
            />
          ))}
        </motion.div>
      </SortableContext>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeWidget && (
          <div className="rotate-1 scale-[1.02] shadow-2xl opacity-95">
            <SortableWidget
              {...activeWidget}
              size={sizes[activeWidget.id] ?? 'full'}
              onToggleSize={() => { }}
              isDragOverlay
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
