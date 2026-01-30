import { Background, Controls, type Edge, MiniMap, type Node, ReactFlow } from "reactflow";
import type { Question } from "@/pages/surveys/CreateSurvey.tsx";
import '@xyflow/react/dist/style.css';
import { t } from "i18next";

const buildNodes = (questions: Question[]): Node[] =>
    questions.map((q, index) => ({
        id: q.id,
        position: { x: 0, y: index * 120 },
        data: {
            label: q.label || t(`surveys.${q.type}`),
            type: q.type,
        },

    }));

const buildEdges = (questions: Question[]): Edge[] =>
    questions.flatMap(q =>
        q.logic
            ?.filter(rule => rule.then.goToQuestionId)
            .map((rule, i) => ({
                id: `${q.id}-${i}`,
                source: q.id,
                target: rule.then.goToQuestionId!,
                label: rule.if
                    .map(c => {
                        if (c.operator === "has_any_value") return "has any value";
                        return `${c.operator} ${
                            Array.isArray(c.value) ? c.value.join(", ") : c.value
                        }`;
                    })
                    .join(" AND "),
                animated: true,
            })) ?? []
    );



export const SurveyLogicGraph = ({ questions }: { questions: Question[] }) => {
    const nodes = buildNodes(questions);
    const edges = buildEdges(questions);

    return (
        <div className="h-[500px] border rounded-lg bg-white">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
            >
                <MiniMap  />
                <Controls />
                <Background gap={12} />
            </ReactFlow>
        </div>
    );
};