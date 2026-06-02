import React from 'react';
import { motion } from 'motion/react';
import { GraphData, GraphNode, GraphEdge, GameState } from '../types';

interface GraphCanvasProps {
  graph: GraphData;
  gameState: GameState;
  onNodeClick: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  showLabels?: boolean;
  theme?: 'map' | 'abstract' | 'blueprint' | 'circuit' | 'museum';
}

export default function GraphCanvas({ graph, gameState, onNodeClick, onEdgeClick, showLabels = false, theme = 'abstract' }: GraphCanvasProps) {
  // Helpers to get pixel positions from % (SVG viewBox 0 0 1000 1000)
  const px = (pct: number) => pct * 10;
  
  const getPathD = (edge: GraphEdge) => {
    const n1 = graph.nodes.find(n => n.id === edge.n1)!;
    const n2 = graph.nodes.find(n => n.id === edge.n2)!;
    const x1 = px(n1.x), y1 = px(n1.y);
    const x2 = px(n2.x), y2 = px(n2.y);
    
    if (!edge.curveOffset) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    
    // Calculate control point for bezier curve
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // Normal vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Offset perpendicular to the line
    const nx = -dy / len * (edge.curveOffset * 10);
    const ny = dx / len * (edge.curveOffset * 10);
    
    return `M ${x1} ${y1} Q ${midX + nx} ${midY + ny} ${x2} ${y2}`;
  };

  const getEdgeStyle = (edge: GraphEdge) => {
    const visited = gameState.visitedEdges.includes(edge.id);
    switch (theme) {
      case 'map':
        return {
          stroke: visited ? '#eab308' : 'rgba(255,255,255,0.4)', // gold / fade
          strokeWidth: visited ? 18 : 24,
          strokeDasharray: visited ? 'none' : '20 10',
          strokeLinecap: 'round' as const
        };
      case 'blueprint':
        return {
          stroke: visited ? '#3b82f6' : 'rgba(30,58,138,0.2)', // blue / dim dark blue
          strokeWidth: visited ? 14 : 8,
          strokeLinecap: 'round' as const
        };
      case 'circuit':
        return {
          stroke: visited ? '#10b981' : 'rgba(6,78,59,0.4)', // green / dim green
          strokeWidth: visited ? 12 : 8,
          strokeLinecap: 'round' as const
        };
      case 'museum':
        return {
          stroke: visited ? '#fbbf24' : 'rgba(120,53,15,0.4)', // gold / dim brown
          strokeWidth: visited ? 14 : 10,
          strokeLinecap: 'round' as const
        };
      case 'abstract':
      default:
        return {
          stroke: visited ? '#a855f7' : '#4b5563', // purple / gray
          strokeWidth: visited ? 12 : 8,
          strokeLinecap: 'round' as const
        };
    }
  };

  const getNodeStyle = (node: GraphNode) => {
    const isCurrent = gameState.currentNode === node.id;
    const isVisited = gameState.visitedEdges.some(e => 
      (graph.edges.find(ge => ge.id === e)?.n1 === node.id) || 
      (graph.edges.find(ge => ge.id === e)?.n2 === node.id)
    ) || isCurrent;
    
    switch (theme) {
      case 'map':
        return {
          fill: isCurrent ? '#fef08a' : (isVisited ? '#ca8a04' : '#166534'), // yellow / dark green land
          r: isCurrent ? 50 : 40,
        };
      case 'blueprint':
        return {
          fill: isCurrent ? '#60a5fa' : '#1e3a8a',
          stroke: '#93c5fd',
          strokeWidth: 4,
          r: 25,
        };
      case 'circuit':
        return {
          fill: isCurrent ? '#34d399' : '#064e3b',
          stroke: '#10b981',
          strokeWidth: 4,
          r: 30,
        };
      case 'museum':
        return {
          fill: isCurrent ? '#fcd34d' : '#78350f',
          stroke: '#fbbf24',
          strokeWidth: 4,
          r: 30,
        };
      case 'abstract':
      default:
         return {
          fill: isCurrent ? '#d8b4fe' : '#7e22ce',
          stroke: isCurrent ? '#ffffff' : 'transparent',
          strokeWidth: 4,
          r: 45,
        };
    }
  };

  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-lg">
        {/* Render Edges */}
        {graph.edges.map(edge => {
          const visited = gameState.visitedEdges.includes(edge.id);
          return (
            <g 
              key={edge.id}
              onClick={(e) => { e.stopPropagation(); onEdgeClick?.(edge.id); }}
              className={onEdgeClick ? "cursor-pointer" : ""}
            >
              {/* Invisible wide path for easier clicking if we want click-on-edge instead of node */}
              <path 
                d={getPathD(edge)} 
                fill="transparent" 
                stroke="transparent" 
                strokeWidth={50} 
              />
              <motion.path
                d={getPathD(edge)}
                fill="transparent"
                animate={getEdgeStyle(edge)}
                transition={{ duration: 0.3 }}
              />
            </g>
          );
        })}
        
        {/* Render Nodes */}
        {graph.nodes.map(node => {
          const isCurrent = gameState.currentNode === node.id;
          return (
            <motion.g 
              key={node.id}
              onClick={() => onNodeClick(node.id)}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Invisible large circle for better touch target */}
              <circle cx={px(node.x)} cy={px(node.y)} r={80} fill="transparent" />
              <motion.circle
                cx={px(node.x)}
                cy={px(node.y)}
                animate={getNodeStyle(node)}
                transition={{ duration: 0.2 }}
              />
              {isCurrent && (
                <motion.circle
                  cx={px(node.x)}
                  cy={px(node.y)}
                  r={getNodeStyle(node).r + 15}
                  fill="transparent"
                  stroke={getNodeStyle(node).fill}
                  strokeWidth="4"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {showLabels && node.label && (
                <text
                  x={px(node.x)}
                  y={px(node.y + 7)} // slight offset
                  textAnchor="middle"
                  fill={theme === 'blueprint' ? '#1e3a8a' : (theme === 'circuit' ? '#4ade80' : (theme === 'museum' ? '#fef08a' : '#ffffff'))}
                  fontSize="28"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-sm"
                >
                  {node.label}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
