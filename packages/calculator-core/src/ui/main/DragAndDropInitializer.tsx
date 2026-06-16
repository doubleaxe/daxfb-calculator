import { Feedback, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { DragDropProvider } from '@dnd-kit/react';

import type { BaseProps } from '#core/types/props.js';

export default function DragAndDropInitializer({ children }: BaseProps) {
    return (
        <DragDropProvider
            modifiers={[RestrictToWindow]}
            plugins={(defaults) => [...defaults, Feedback.configure({ dropAnimation: null })]}
            sensors={() => [
                PointerSensor.configure({
                    activationConstraints: [
                        new PointerActivationConstraints.Distance({ value: 8 }),
                        new PointerActivationConstraints.Delay({ value: 200, tolerance: Infinity }),
                    ],
                }),
            ]}
        >
            {children}
        </DragDropProvider>
    );
}
