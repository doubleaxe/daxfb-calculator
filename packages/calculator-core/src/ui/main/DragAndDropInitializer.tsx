import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import type { BaseProps } from '#core/types/props';

export default function DragAndDropInitializer({ children }: BaseProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8, delay: 200, tolerance: Infinity } })
    );

    return (
        <DndContext modifiers={[restrictToWindowEdges]} sensors={sensors}>
            {children}
        </DndContext>
    );
}
