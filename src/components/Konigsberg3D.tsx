import React, { useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sky, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';
import { konigsbergGraph } from '../data/graphs';
import { GameState, GraphNode, GraphEdge } from '../types';

function getEdgeCurve(edge: GraphEdge) {
  const n1 = konigsbergGraph.nodes.find(n => n.id === edge.n1)!;
  const n2 = konigsbergGraph.nodes.find(n => n.id === edge.n2)!;
  const v1 = new THREE.Vector3((n1.x - 50) / 4, 0.4, (n1.y - 50) / 4);
  const v2 = new THREE.Vector3((n2.x - 50) / 4, 0.4, (n2.y - 50) / 4);
  
  let mid = v1.clone().add(v2).multiplyScalar(0.5);
  
  if (edge.curveOffset) {
    const dir = v2.clone().sub(v1).normalize();
    const normal = new THREE.Vector3(-dir.z, 0, dir.x); 
    mid.add(normal.multiplyScalar(edge.curveOffset * 1.5));
  }
  mid.y = 1.2; // The bridge arc height
  
  return new THREE.CatmullRomCurve3([v1, mid, v2]);
}

interface BridgeProps {
  edge: GraphEdge;
  visited: boolean;
  onClick: () => void;
}

function Bridge({ edge, visited, onClick }: BridgeProps) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const curve = useMemo(() => getEdgeCurve(edge), [edge]);

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onClick(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} 
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
    >
      <mesh>
        <tubeGeometry args={[curve, 24, 0.4, 8, false]} />
        <meshStandardMaterial 
          color={visited ? '#fbbf24' : (hovered ? '#f97316' : '#ea580c')} 
          metalness={0.1} 
          roughness={0.9} 
          transparent={visited}
          opacity={visited ? 0.3 : 1}
        />
      </mesh>
      {/* Invisible thicker hit box for easier clicking */}
      <mesh visible={false}>
        <tubeGeometry args={[curve, 12, 1.5, 8, false]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

interface IslandProps {
  node: GraphNode;
  isCurrent: boolean;
  onClick: () => void;
}

function Island({ node, isCurrent, onClick }: IslandProps) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const x = (node.x - 50) / 4;
  const z = (node.y - 50) / 4;

  return (
    <group position={[x, 0, z]}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} 
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
        position={[0, 0.2, 0]}
      >
        <cylinderGeometry args={[2.8, 3.0, 0.6, 32]} />
        <meshStandardMaterial color={isCurrent ? '#fef08a' : (hovered ? '#6ee7b7' : '#10b981')} />
      </mesh>

      {/* Invisible larger hit target */}
      <mesh visible={false} onClick={(e) => { e.stopPropagation(); onClick(); }} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[4, 4, 2, 16]} />
        <meshBasicMaterial />
      </mesh>
      
      {isCurrent && (
        <mesh position={[0, 0.5, 0]}>
          <ringGeometry args={[2.6, 3.0, 32]} />
          <meshBasicMaterial color="#eab308" side={THREE.DoubleSide} />
        </mesh>
      )}

      <Html position={[0, 2.5, 0]} center sprite zIndexRange={[100, 0]}>
        <div className="bg-slate-900/80 text-white px-3 py-1 rounded-full text-sm font-bold shadow-xl border border-slate-600 backdrop-blur-sm select-none pointer-events-none">
          {node.label}
        </div>
      </Html>
    </group>
  );
}

function CameraRig({ currentNodeId, cameraMode }: { currentNodeId: string | null, cameraMode: 'follow' | 'overview' }) {
  const vec = new THREE.Vector3();
  const target = new THREE.Vector3();
  
  useFrame((state) => {
    if (currentNodeId && cameraMode === 'follow') {
      const node = konigsbergGraph.nodes.find(n => n.id === currentNodeId)!;
      const nx = (node.x - 50) / 4;
      const nz = (node.y - 50) / 4;
      
      // Third person / overhead angled view
      vec.set(nx, 8, nz + 8);
      target.set(nx, 0, nz - 2);
    } else {
      // Overview
      vec.set(0, 16, 16);
      target.set(0, 0, 0);
    }
    
    state.camera.position.lerp(vec, 0.03); // matches the walking speed better
    
    // Smooth lookAt
    const currentLookAt = new THREE.Vector3(0,0,-1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
    currentLookAt.lerp(target, 0.03);
    state.camera.lookAt(currentLookAt);
  });

  return null;
}

function Player({ gameState }: { gameState: GameState }) {
  const ref = React.useRef<THREE.Group>(null);
  
  const [animating, setAnimating] = useState(false);
  const progress = React.useRef(0);
  const targetCurve = React.useRef<THREE.CatmullRomCurve3 | null>(null);
  const reverseCurve = React.useRef(false);

  const prevCurrentNode = React.useRef(gameState.currentNode);

  React.useEffect(() => {
    if (gameState.currentNode !== prevCurrentNode.current) {
      if (!prevCurrentNode.current && gameState.currentNode) {
         const node = konigsbergGraph.nodes.find(n => n.id === gameState.currentNode)!;
         if (ref.current) {
            ref.current.position.set((node.x - 50) / 4, 0.5, (node.y - 50) / 4);
            ref.current.lookAt(0, 0.5, 0);
         }
      } else if (prevCurrentNode.current && gameState.currentNode) {
         const lastEdgeId = gameState.visitedEdges[gameState.visitedEdges.length - 1];
         if (lastEdgeId) {
             const edge = konigsbergGraph.edges.find(e => e.id === lastEdgeId)!;
             targetCurve.current = getEdgeCurve(edge);
             reverseCurve.current = (edge.n1 === gameState.currentNode);
             progress.current = 0;
             setAnimating(true);
         } else {
             const node = konigsbergGraph.nodes.find(n => n.id === gameState.currentNode)!;
             if (ref.current) {
                ref.current.position.set((node.x - 50) / 4, 0.5, (node.y - 50) / 4);
                setAnimating(false);
             }
         }
      } else if (!gameState.currentNode && prevCurrentNode.current) {
         setAnimating(false);
      }
      prevCurrentNode.current = gameState.currentNode;
    }
  }, [gameState.currentNode, gameState.visitedEdges]);

  useFrame((state, delta) => {
     if (animating && targetCurve.current && ref.current) {
        progress.current += delta * 1.2; // roughly 0.8s to cross bridge
        if (progress.current >= 1) {
           progress.current = 1;
           setAnimating(false);
        }
        const t = reverseCurve.current ? 1 - progress.current : progress.current;
        const pos = targetCurve.current.getPointAt(Math.max(0, Math.min(1, t)));
        
        pos.y += 0.2; 
        const bounce = Math.abs(Math.sin(progress.current * Math.PI * 8)) * 0.2;
        pos.y += bounce;

        ref.current.position.copy(pos);

        try {
          const tangent = targetCurve.current.getTangentAt(Math.max(0, Math.min(1, t)));
          if (reverseCurve.current) tangent.negate();
          const lookTarget = pos.clone().add(tangent);
          lookTarget.y = ref.current.position.y;
          ref.current.lookAt(lookTarget);
        } catch(e) {}
     }
  });

  if (!gameState.currentNode) return null;

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.5, 4, 16]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" />
      </mesh>
      <mesh position={[0.15, 1.0, 0.28]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.15, 1.0, 0.28]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 0.5, -0.3]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#818cf8" />
      </mesh>
    </group>
  );
}

interface Props {
  gameState: GameState;
  onNodeClick: (nodeId: string) => void;
  onEdgeClick: (edgeId: string) => void;
  cameraMode?: 'follow' | 'overview';
}

export default function Konigsberg3D({ gameState, onNodeClick, onEdgeClick, cameraMode = 'follow' }: Props) {
  return (
    <Canvas shadows camera={{ position: [0, 15, 15], fov: 45 }}>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
      
      {/* River */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.1} roughness={0.4} />
      </mesh>

      {/* Islands */}
      {konigsbergGraph.nodes.map(node => (
        <Island 
          key={node.id} 
          node={node} 
          isCurrent={gameState.currentNode === node.id}
          onClick={() => onNodeClick(node.id)}
        />
      ))}

      {/* Player Character */}
      <Player gameState={gameState} />

      {/* Bridges */}
      {konigsbergGraph.edges.map(edge => {
        const visited = gameState.visitedEdges.includes(edge.id);

        return (
          <Bridge 
            key={edge.id}
            edge={edge}
            visited={visited}
            onClick={() => onEdgeClick(edge.id)}
          />
        );
      })}

      <CameraRig currentNodeId={gameState.currentNode} cameraMode={cameraMode} />
    </Canvas>
  );
}
