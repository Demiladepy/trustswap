export const generateTrustNetwork = (wallet: string) => {
    return {
        nodes: [
            { id: '1', label: 'You', tier: 'diamond', color: 'cyan' },
            { id: '2', label: 'Peer 1', tier: 'gold', color: 'yellow' }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' }
        ]
    };
};
