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
import { getTheme, TierType } from '@/lib/theme';
import { Network, Share2 } from 'lucide-react';

// Custom Node for the user
const UserNode = ({ data }: { data: { label: string, tier: string } }) => {
    const theme = getTheme(data.tier);
    return (
        <div className="relative group">
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"
                style={{ background: theme.glow }}
            />
            <div
                className="relative px-6 py-3 rounded-full border-2 bg-gray-900 text-white font-black shadow-2xl flex flex-col items-center min-w-25"
                style={{ borderColor: theme.primary }}
            >
                <Handle type="source" position={Position.Top} className="bg-white! w-1! h-1! border-none!" />
                <Handle type="source" position={Position.Right} className="bg-white! w-1! h-1! border-none!" />
                <Handle type="source" position={Position.Bottom} className="bg-white! w-1! h-1! border-none!" />
                <Handle type="source" position={Position.Left} className="bg-white! w-1! h-1! border-none!" />

                <span className="text-xs uppercase tracking-tighter opacity-50 mb-0.5">Primary Node</span>
                <span className="text-sm tracking-tight">{data.label}</span>
            </div>
        </div>
    );
};

// Custom Node for connections
const PeerNode = ({ data }: { data: { label: string, tier: string } }) => {
    const theme = getTheme(data.tier);
    return (
        <div
            className="px-4 py-2 rounded-xl border bg-gray-900/60 backdrop-blur-md transition-all hover:scale-110 hover:bg-gray-800"
            style={{ borderColor: `${theme.primary}40` }}
        >
            <Handle type="target" position={Position.Top} className="bg-transparent! border-none!" />
            <Handle type="target" position={Position.Bottom} className="bg-transparent! border-none!" />
            <Handle type="target" position={Position.Left} className="bg-transparent! border-none!" />
            <Handle type="target" position={Position.Right} className="bg-transparent! border-none!" />
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                <div className="text-[10px] font-mono font-bold text-gray-400">{data.label}</div>
            </div>
        </div>
    );
};

const nodeTypes = {
    user: UserNode,
    peer: PeerNode
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'user',
        position: { x: 250, y: 250 },
        data: { label: 'YOU', tier: 'bronze' }
    },
    { id: '2', type: 'peer', position: { x: 100, y: 100 }, data: { label: 'alice.sol', tier: 'gold' } },
    { id: '3', type: 'peer', position: { x: 450, y: 120 }, data: { label: 'bob.sol', tier: 'silver' } },
    { id: '4', type: 'peer', position: { x: 480, y: 380 }, data: { label: 'char.sol', tier: 'diamond' } },
    { id: '5', type: 'peer', position: { x: 80, y: 400 }, data: { label: 'dave.sol', tier: 'bronze' } },
    { id: '6', type: 'peer', position: { x: 250, y: 50 }, data: { label: 'eve.sol', tier: 'gold' } },
    { id: '7', type: 'peer', position: { x: 50, y: 250 }, data: { label: 'frank.sol', tier: 'silver' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#94a3b8', strokeWidth: 1 } },
    { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#22d3ee', strokeWidth: 3 } },
    { id: 'e1-5', source: '1', target: '5', animated: true, style: { stroke: '#f97316', strokeWidth: 1 } },
    { id: 'e1-6', source: '1', target: '6', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
    { id: 'e1-7', source: '1', target: '7', animated: true, style: { stroke: '#94a3b8', strokeWidth: 1 } },
];

export const TrustNetwork = () => {
    const { tier } = useTier();

    const nodesWithUser = initialNodes.map(n =>
        n.id === '1' ? { ...n, data: { ...n.data, tier: tier } } : n
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithUser);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    React.useEffect(() => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === '1') {
                return { ...node, data: { ...node.data, tier: tier } };
            }
            return node;
        }));
    }, [tier, setNodes]);

    return (
        <div className="w-full h-full min-h-125 border border-white/5 rounded-4xl overflow-hidden bg-black/40 relative group shadow-2xl backdrop-blur-sm">
            <div className="absolute top-6 left-6 z-10 pointer-events-none flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
                    <Network className="text-blue-400" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-heading font-black text-white">TRUST NETWORK</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">On-chain reputation graph</p>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-10 flex gap-2">
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs text-gray-400">
                    <Share2 size={16} />
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.5}
                maxZoom={1.5}
                attributionPosition="bottom-right"
            >
                <Background color="#1d4ed8" gap={25} size={1} style={{ opacity: 0.15 }} />
                <Controls className="bg-white/10 border border-white/20 text-white fill-white rounded-xl overflow-hidden scale-75 origin-bottom-left" />
            </ReactFlow>

            <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-gray-900/40 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/5 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                Interactive Exploration Active
            </div>
        </div>
    );
};
