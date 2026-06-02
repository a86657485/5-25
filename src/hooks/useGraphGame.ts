import { useState } from 'react';
import { GraphData, GameState } from '../types';

export function useGraphGame(graph: GraphData) {
  const [gameState, setGameState] = useState<GameState>({
    currentNode: null,
    visitedEdges: [],
  });

  const handleNodeClick = (nodeId: string) => {
    // Starting the path
    if (gameState.currentNode === null) {
      setGameState({ currentNode: nodeId, visitedEdges: [] });
      return;
    }

    // Trying to move
    const availableEdges = graph.edges.filter(e => 
      !gameState.visitedEdges.includes(e.id) &&
      ((e.n1 === gameState.currentNode && e.n2 === nodeId) || 
       (e.n2 === gameState.currentNode && e.n1 === nodeId))
    );

    if (availableEdges.length > 0) {
      // Pick the first available edge
      const edgeToTraverse = availableEdges[0];
      setGameState(prev => ({
        currentNode: nodeId,
        visitedEdges: [...prev.visitedEdges, edgeToTraverse.id]
      }));
    } else {
      // Invalid move (not connected or edge already visited)
      // Visual feedback could be wired here
    }
  };

  const handleEdgeClick = (edgeId: string) => {
    if (gameState.visitedEdges.includes(edgeId)) return;
    const edge = graph.edges.find(e => e.id === edgeId);
    if (!edge) return;

    if (gameState.currentNode === null) {
      // Start game automatically traversing this edge (from n1 to n2 arbitrarily)
      setGameState({ currentNode: edge.n2, visitedEdges: [edgeId] });
      return;
    }

    // Check if it connects to current node
    if (edge.n1 === gameState.currentNode) {
      setGameState(prev => ({ currentNode: edge.n2, visitedEdges: [...prev.visitedEdges, edge.id] }));
    } else if (edge.n2 === gameState.currentNode) {
      setGameState(prev => ({ currentNode: edge.n1, visitedEdges: [...prev.visitedEdges, edge.id] }));
    }
  };

  const undo = () => {
    if (gameState.visitedEdges.length === 0) {
      if (gameState.currentNode !== null) {
        setGameState({ currentNode: null, visitedEdges: [] });
      }
      return;
    }
    
    const newEdges = [...gameState.visitedEdges];
    const removedEdgeId = newEdges.pop()!;
    const removedEdge = graph.edges.find(e => e.id === removedEdgeId)!;
    
    // Previous node is the one on the removed edge that ISN'T the current node
    const prevNode = removedEdge.n1 === gameState.currentNode ? removedEdge.n2 : removedEdge.n1;
    
    setGameState({
      currentNode: prevNode,
      visitedEdges: newEdges
    });
  };

  const reset = () => {
    setGameState({ currentNode: null, visitedEdges: [] });
  };

  const isComplete = gameState.visitedEdges.length === graph.edges.length;

  return {
    gameState,
    handleNodeClick,
    handleEdgeClick,
    undo,
    reset,
    isComplete
  };
}
