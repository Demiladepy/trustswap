"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTier } from '@/context/TierContext';

// Custom Node for the user
const UserNode = ({ data }: { data: { label: string, tier: string } }) => (
    <div className={`
        relative px-4 py-3 rounded-full shadow-lg border-2 
        ${data.tier === 'diamond' ? 'bg-cyan-900/80 border-cyan-400 shadow-cyan-500/50' : ''}
        ${data.tier === 'gold' ? 'bg-yellow-900/80 border-yellow-400 shadow-yellow-500/50' : ''}
        ${data.tier === 'silver' ? 'bg-slate-700/80 border-slate-300 shadow-slate-400/50' : ''}
        ${data.tier === 'bronze' ? 'bg-orange-900/80 border-orange-400 shadow-orange-500/50' : ''}
    `}>
        <Handle type="source" position={Position.Top} className="!bg-white" />
        <Handle type="source" position={Position.Right} className="!bg-white" />
        <Handle type="source" position={Position.Bottom} className="!bg-white" />
        <Handle type="source" position={Position.Left} className="!bg-white" />

        <div className="font-bold text-white text-sm">{data.label}</div>
        <div className="text-[10px] text-gray-300 uppercase tracking-wider text-center">{data.tier}</div>
    </div>
);

// Custom Node for connections
const PeerNode = ({ data }: { data: { label: string, tier: string } }) => (
    <div className={`
        px-3 py-2 rounded-xl border bg-black/50 backdrop-blur-sm
        ${data.tier === 'diamond' ? 'border-cyan-500/50 text-cyan-100' : ''}
        ${data.tier === 'gold' ? 'border-yellow-500/50 text-yellow-100' : ''}
        ${data.tier === 'silver' ? 'border-slate-400/50 text-slate-100' : ''}
        ${data.tier === 'bronze' ? 'border-orange-500/50 text-orange-100' : ''}
    `}>
        <Handle type="target" position={Position.Top} className="!bg-transparent" />
        <Handle type="target" position={Position.Bottom} className="!bg-transparent" />
        <Handle type="target" position={Position.Left} className="!bg-transparent" />
        <Handle type="target" position={Position.Right} className="!bg-transparent" />
        <div className="text-xs font-mono">{data.label}</div>
    </div>
);

const nodeTypes = {
    user: UserNode,
    peer: PeerNode
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'user',
        position: { x: 250, y: 250 },
        data: { label: 'You', tier: 'bronze' }
    },
    { id: '2', type: 'peer', position: { x: 100, y: 100 }, data: { label: 'Alice', tier: 'gold' } },
    { id: '3', type: 'peer', position: { x: 400, y: 100 }, data: { label: 'Bob', tier: 'silver' } },
    { id: '4', type: 'peer', position: { x: 400, y: 400 }, data: { label: 'Charlie', tier: 'diamond' } },
    { id: '5', type: 'peer', position: { x: 100, y: 400 }, data: { label: 'Dave', tier: 'bronze' } },
    { id: '6', type: 'peer', position: { x: 250, y: 50 }, data: { label: 'Eve', tier: 'gold' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fbbf24' } }, // Gold
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#94a3b8' } }, // Silver
    { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#22d3ee' } }, // Diamond
    { id: 'e1-5', source: '1', target: '5', animated: true, style: { stroke: '#f97316' } }, // Bronze
    { id: 'e1-6', source: '1', target: '6', animated: true, style: { stroke: '#fbbf24' } },
];

export const TrustNetwork = () => {
    const { tier } = useTier();

    // Update user node tier dynamically
    const nodesWithUser = initialNodes.map(n =>
        n.id === '1' ? { ...n, data: { ...n.data, tier: tier } } : n
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithUser);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes when tier changes
    React.useEffect(() => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === '1') {
                return { ...node, data: { ...node.data, tier: tier } };
            }
            return node;
        }));
    }, [tier, setNodes]);

    return (
        <div className="w-full h-[500px] border border-white/10 rounded-2xl overflow-hidden bg-[#0a0118] relative group">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-lg font-heading font-bold text-white">Trust Network</h3>
                <p className="text-xs text-gray-400">Visualizing your on-chain reputation</p>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.5}
                maxZoom={1.5}
                attributionPosition="bottom-right"
            >
                <Background color="#4f46e5" gap={20} size={1} style={{ opacity: 0.1 }} />
                <Controls className="bg-white/10 border border-white/20 text-white fill-white" />
            </ReactFlow>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0D0221] via-transparent to-transparent opacity-50" />
        </div>
    );
};
