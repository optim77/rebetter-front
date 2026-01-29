import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";
import { useEffect, useState } from "react";

const SortableItem = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 border rounded-md bg-background cursor-grab"
            {...attributes}
            {...listeners}
        >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span>{id}</span>
        </div>
    );
};


export const RatingAnswersQuestion = ({ question }: { question: Question }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const options = question.options ?? [];
    const [order, setOrder] = useState<string[]>(options);

    useEffect(() => {
        setOrder(options);
    }, [options]);

    const onDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = order.indexOf(active.id);
        const newIndex = order.indexOf(over.id);

        const reordered = [...order];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        setOrder(reordered);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <SortableContext
                items={order}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {order.map((opt, i) => (
                        <SortableItem key={`${opt}-${i}`} id={opt} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};