import { GraphData } from '../types';

export const konigsbergGraph: GraphData = {
  nodes: [
    { id: 'top', x: 50, y: 25, label: 'A' },
    { id: 'bottom', x: 50, y: 75, label: 'C' },
    { id: 'left', x: 25, y: 50, label: 'D' },
    { id: 'right', x: 75, y: 50, label: 'B' },
  ],
  edges: [
    { id: 'e1', n1: 'top', n2: 'left', curveOffset: 1.5 },
    { id: 'e2', n1: 'top', n2: 'left', curveOffset: -1.5 },
    { id: 'e3', n1: 'bottom', n2: 'left', curveOffset: 1.5 },
    { id: 'e4', n1: 'bottom', n2: 'left', curveOffset: -1.5 },
    { id: 'e5', n1: 'top', n2: 'right' },
    { id: 'e6', n1: 'bottom', n2: 'right' },
    { id: 'e7', n1: 'left', n2: 'right' },
  ]
};

// Graph that CAN be drawn (House)
export const envelopeGraph: GraphData = {
  nodes: [
    { id: 'bl', x: 30, y: 70 },
    { id: 'br', x: 70, y: 70 },
    { id: 'tl', x: 30, y: 40 },
    { id: 'tr', x: 70, y: 40 },
    { id: 'roof', x: 50, y: 20 },
  ],
  edges: [
    { id: '1', n1: 'bl', n2: 'br' },
    { id: '2', n1: 'bl', n2: 'tl' },
    { id: '3', n1: 'br', n2: 'tr' },
    { id: '4', n1: 'tl', n2: 'tr' },
    { id: '5', n1: 'tl', n2: 'roof' },
    { id: '6', n1: 'tr', n2: 'roof' },
    { id: '7', n1: 'bl', n2: 'tr' }, // diagonal
    { id: '8', n1: 'br', n2: 'tl' }, // diagonal
  ]
};

// Simple triangle (Euler's loop - all even)
export const triangleGraph: GraphData = {
  nodes: [
    { id: 'n1', x: 50, y: 30 },
    { id: 'n2', x: 30, y: 70 },
    { id: 'n3', x: 70, y: 70 },
  ],
  edges: [
    { id: 'e1', n1: 'n1', n2: 'n2' },
    { id: 'e2', n1: 'n2', n2: 'n3' },
    { id: 'e3', n1: 'n3', n2: 'n1' },
  ]
};

export const cityGraph: GraphData = {
  nodes: [
    { id: 'school', x: 20, y: 20, label: '学校' },
    { id: 'park', x: 80, y: 20, label: '公园' },
    { id: 'mall', x: 20, y: 80, label: '超市' },
    { id: 'home', x: 80, y: 80, label: '家' },
    { id: 'center', x: 50, y: 50, label: '广场' },
  ],
  edges: [
    { id: 'c1', n1: 'school', n2: 'park' },
    { id: 'c2', n1: 'park', n2: 'home' },
    { id: 'c3', n1: 'home', n2: 'mall' },
    { id: 'c4', n1: 'mall', n2: 'school' },
    { id: 'c5', n1: 'school', n2: 'center' },
    { id: 'c6', n1: 'mall', n2: 'center' },
    { id: 'c7', n1: 'home', n2: 'center' },
  ]
};

export const circuitGraph: GraphData = {
  nodes: [
    { id: 'pwr', x: 15, y: 50, label: 'PWR' },
    { id: 'cpu', x: 40, y: 30, label: 'CPU' },
    { id: 'ram', x: 40, y: 70, label: 'RAM' },
    { id: 'gpu', x: 70, y: 30, label: 'GPU' },
    { id: 'ssd', x: 70, y: 70, label: 'SSD' },
    { id: 'gnd', x: 85, y: 50, label: 'GND' },
  ],
  edges: [
    { id: 'e1', n1: 'pwr', n2: 'cpu' },
    { id: 'e2', n1: 'cpu', n2: 'ram' },
    { id: 'e3', n1: 'ram', n2: 'ssd' },
    { id: 'e4', n1: 'ssd', n2: 'cpu' },
    { id: 'e5', n1: 'cpu', n2: 'gpu' },
    { id: 'e6', n1: 'gpu', n2: 'ram' },
    { id: 'e7', n1: 'gnd', n2: 'ram' },
  ]
};

export const museumGraph: GraphData = {
  nodes: [
    { id: 'n', x: 50, y: 15, label: '北' },
    { id: 'e', x: 85, y: 40, label: '东' },
    { id: 'se', x: 70, y: 80, label: '东南' },
    { id: 'sw', x: 30, y: 80, label: '西南' },
    { id: 'w', x: 15, y: 40, label: '西' },
  ],
  edges: [
    // Outline
    { id: 'r1', n1: 'n', n2: 'e' },
    { id: 'r2', n1: 'e', n2: 'se' },
    { id: 'r3', n1: 'se', n2: 'sw' },
    { id: 'r4', n1: 'sw', n2: 'w' },
    { id: 'r5', n1: 'w', n2: 'n' },
    // Star
    { id: 'r6', n1: 'n', n2: 'se' },
    { id: 'r7', n1: 'se', n2: 'w' },
    { id: 'r8', n1: 'w', n2: 'e' },
    { id: 'r9', n1: 'e', n2: 'sw' },
    { id: 'r10', n1: 'sw', n2: 'n' },
  ]
};
