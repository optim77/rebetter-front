import { Background, Controls, type Edge, type Node, ReactFlow } from "reactflow";
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
const buildDefaultEdges = (questions: Question[]): Edge[] =>
    questions.slice(0, -1).map((q, i) => ({
        id: `default-${q.id}`,
        source: q.id,
        target: questions[i + 1].id,
        style: { strokeDasharray: "4 2" },
        label: t("surveys.default_flow"),
    }));


const buildLogicEdges = (questions: Question[]): Edge[] =>
    questions.flatMap(q =>
        q.logic
            ?.filter(rule => rule.then.goToQuestionId)
            .map((rule, i) => ({
                id: `logic-${q.id}-${i}`,
                source: q.id,
                target: rule.then.goToQuestionId!,
                animated: true,
                label: rule.if.map(c => c.operator).join(" AND "),
            })) ?? []
    );



export const SurveyLogicGraph = ({ questions }: { questions: Question[] }) => {
    const nodes = buildNodes(questions);
    const edges = [
        ...buildDefaultEdges(questions),
        ...buildLogicEdges(questions),
    ];
    return (
        <div className="h-[500px] border rounded-lg bg-white">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
            >
                {/*<MiniMap  />*/}
                <Controls />
                <Background gap={12} />
            </ReactFlow>
        </div>
    );
};