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

export const qGraph1: GraphData = {
  // Rectangle with 2 crosses
  nodes: [
    { id: 'tl', x: 20, y: 20, label: '' },
    { id: 'tm', x: 50, y: 20, label: '' },
    { id: 'tr', x: 80, y: 20, label: '' },
    { id: 'bl', x: 20, y: 80, label: '' },
    { id: 'bm', x: 50, y: 80, label: '' },
    { id: 'br', x: 80, y: 80, label: '' },
    { id: 'c1', x: 35, y: 50, label: '' },
    { id: 'c2', x: 65, y: 50, label: '' },
  ],
  edges: [
    { id: 'e1', n1: 'tl', n2: 'tm' }, { id: 'e2', n1: 'tm', n2: 'tr' },
    { id: 'e3', n1: 'bl', n2: 'bm' }, { id: 'e4', n1: 'bm', n2: 'br' },
    { id: 'e5', n1: 'tl', n2: 'bl' }, { id: 'e6', n1: 'tm', n2: 'bm' }, { id: 'e7', n1: 'tr', n2: 'br' },
    { id: 'e8', n1: 'tl', n2: 'c1' }, { id: 'e9', n1: 'bl', n2: 'c1' }, { id: 'e10', n1: 'tm', n2: 'c1' }, { id: 'e11', n1: 'bm', n2: 'c1' },
    { id: 'e12', n1: 'tm', n2: 'c2' }, { id: 'e13', n1: 'bm', n2: 'c2' }, { id: 'e14', n1: 'tr', n2: 'c2' }, { id: 'e15', n1: 'br', n2: 'c2' },
  ]
};

export const qGraph2: GraphData = {
  // Nested diamond/cross inside a square
  nodes: [
    { id: 'tl', x: 10, y: 10, label: '' }, { id: 'tm', x: 50, y: 10, label: '' }, { id: 'tr', x: 90, y: 10, label: '' },
    { id: 'lm', x: 10, y: 50, label: '' }, { id: 'c', x: 50, y: 50, label: '' }, { id: 'rm', x: 90, y: 50, label: '' },
    { id: 'bl', x: 10, y: 90, label: '' }, { id: 'bm', x: 50, y: 90, label: '' }, { id: 'br', x: 90, y: 90, label: '' },
  ],
  edges: [
    { id: 'e1', n1: 'tl', n2: 'tm' }, { id: 'e2', n1: 'tm', n2: 'tr' },
    { id: 'e3', n1: 'tr', n2: 'rm' }, { id: 'e4', n1: 'rm', n2: 'br' },
    { id: 'e5', n1: 'br', n2: 'bm' }, { id: 'e6', n1: 'bm', n2: 'bl' },
    { id: 'e7', n1: 'bl', n2: 'lm' }, { id: 'e8', n1: 'lm', n2: 'tl' },
    { id: 'e9', n1: 'tm', n2: 'c' }, { id: 'e10', n1: 'bm', n2: 'c' },
    { id: 'e11', n1: 'lm', n2: 'c' }, { id: 'e12', n1: 'rm', n2: 'c' },
    { id: 'e13', n1: 'tm', n2: 'rm' }, { id: 'e14', n1: 'rm', n2: 'bm' },
    { id: 'e15', n1: 'bm', n2: 'lm' }, { id: 'e16', n1: 'lm', n2: 'tm' },
  ]
};

export const qGraph3: GraphData = {
  // Envelope with midline
  nodes: [
    { id: 'top', x: 50, y: 10, label: '' },
    { id: 'tl', x: 10, y: 30, label: '' }, { id: 'tr', x: 90, y: 30, label: '' },
    { id: 'ml', x: 10, y: 60, label: '' }, { id: 'mr', x: 90, y: 60, label: '' },
    { id: 'bl', x: 10, y: 90, label: '' }, { id: 'br', x: 90, y: 90, label: '' },
    { id: 'c', x: 50, y: 60, label: '' }
  ],
  edges: [
    { id: 'e1', n1: 'tl', n2: 'top' }, { id: 'e2', n1: 'tr', n2: 'top' },
    { id: 'e3', n1: 'tl', n2: 'tr' }, { id: 'e4', n1: 'tl', n2: 'ml' }, { id: 'e5', n1: 'ml', n2: 'bl' },
    { id: 'e6', n1: 'bl', n2: 'br' }, { id: 'e7', n1: 'br', n2: 'mr' }, { id: 'e8', n1: 'mr', n2: 'tr' },
    { id: 'e9', n1: 'tl', n2: 'c' }, { id: 'e10', n1: 'tr', n2: 'c' }, { id: 'e11', n1: 'bl', n2: 'c' }, { id: 'e12', n1: 'br', n2: 'c' },
    { id: 'e13', n1: 'ml', n2: 'c' }, { id: 'e14', n1: 'mr', n2: 'c' }
  ]
};

export const qGraph4: GraphData = {
  // Hexagon with diagonals
  nodes: [
    { id: 'n1', x: 50, y: 10, label: '' }, { id: 'n2', x: 85, y: 30, label: '' }, { id: 'n3', x: 85, y: 70, label: '' },
    { id: 'n4', x: 50, y: 90, label: '' }, { id: 'n5', x: 15, y: 70, label: '' }, { id: 'n6', x: 15, y: 30, label: '' },
    { id: 'c', x: 50, y: 50, label: '' }
  ],
  edges: [
    { id: 'e1', n1: 'n1', n2: 'n2' }, { id: 'e2', n1: 'n2', n2: 'n3' }, { id: 'e3', n1: 'n3', n2: 'n4' },
    { id: 'e4', n1: 'n4', n2: 'n5' }, { id: 'e5', n1: 'n5', n2: 'n6' }, { id: 'e6', n1: 'n6', n2: 'n1' },
    { id: 'e7', n1: 'n1', n2: 'c' }, { id: 'e8', n1: 'n2', n2: 'c' }, { id: 'e9', n1: 'n3', n2: 'c' },
    { id: 'e10', n1: 'n4', n2: 'c' }, { id: 'e11', n1: 'n5', n2: 'c' }, { id: 'e12', n1: 'n6', n2: 'c' },
  ]
};

export const qGraph5: GraphData = {
  // Simple envelope
  nodes: [
    { id: 'top', x: 50, y: 20, label: '' },
    { id: 'tl', x: 20, y: 40, label: '' }, { id: 'tr', x: 80, y: 40, label: '' },
    { id: 'bl', x: 20, y: 80, label: '' }, { id: 'br', x: 80, y: 80, label: '' }
  ],
  edges: [
    { id: 'e1', n1: 'top', n2: 'tl' }, { id: 'e2', n1: 'top', n2: 'tr' },
    { id: 'e3', n1: 'tl', n2: 'tr' }, { id: 'e4', n1: 'tl', n2: 'bl' },
    { id: 'e5', n1: 'tr', n2: 'br' }, { id: 'e6', n1: 'bl', n2: 'br' },
    { id: 'e7', n1: 'tl', n2: 'br' }, { id: 'e8', n1: 'tr', n2: 'bl' }
  ]
};

export const qGraph6: GraphData = {
  // Two adjacent squares
  nodes: [
    { id: 'tl', x: 30, y: 10, label: '' }, { id: 'tm', x: 30, y: 50, label: '' }, { id: 'bl', x: 30, y: 90, label: '' },
    { id: 'tr', x: 70, y: 10, label: '' }, { id: 'bm', x: 70, y: 50, label: '' }, { id: 'br', x: 70, y: 90, label: '' }
  ],
  edges: [
    { id: 'e1', n1: 'tl', n2: 'tm' }, { id: 'e2', n1: 'tm', n2: 'bl' },
    { id: 'e3', n1: 'tr', n2: 'bm' }, { id: 'e4', n1: 'bm', n2: 'br' },
    { id: 'e5', n1: 'tl', n2: 'tr' }, { id: 'e6', n1: 'tm', n2: 'bm' }, { id: 'e7', n1: 'bl', n2: 'br' }
  ]
};

export const qGraph7: GraphData = {
  // Pentagram in pentagon
  nodes: [
    { id: 'n1', x: 50, y: 5, label: '' },
    { id: 'n2', x: 93, y: 36, label: '' },
    { id: 'n3', x: 76, y: 88, label: '' },
    { id: 'n4', x: 24, y: 88, label: '' },
    { id: 'n5', x: 7, y: 36, label: '' },
  ],
  edges: [
    { id: 'e1', n1: 'n1', n2: 'n2' }, { id: 'e2', n1: 'n2', n2: 'n3' }, { id: 'e3', n1: 'n3', n2: 'n4' },
    { id: 'e4', n1: 'n4', n2: 'n5' }, { id: 'e5', n1: 'n5', n2: 'n1' },
    { id: 'e6', n1: 'n1', n2: 'n3' }, { id: 'e7', n1: 'n3', n2: 'n5' }, { id: 'e8', n1: 'n5', n2: 'n2' },
    { id: 'e9', n1: 'n2', n2: 'n4' }, { id: 'e10', n1: 'n4', n2: 'n1' }
  ]
};

export const qGraph8: GraphData = {
  // Bowtie
  nodes: [
    { id: 'l1', x: 20, y: 20, label: '' }, { id: 'l2', x: 20, y: 80, label: '' },
    { id: 'r1', x: 80, y: 20, label: '' }, { id: 'r2', x: 80, y: 80, label: '' },
    { id: 'c', x: 50, y: 50, label: '' }
  ],
  edges: [
    { id: 'e1', n1: 'l1', n2: 'l2' }, { id: 'e2', n1: 'l1', n2: 'c' }, { id: 'e3', n1: 'l2', n2: 'c' },
    { id: 'e4', n1: 'r1', n2: 'r2' }, { id: 'e5', n1: 'r1', n2: 'c' }, { id: 'e6', n1: 'r2', n2: 'c' }
  ]
};

export const qGraph9: GraphData = {
  // Cube projection
  nodes: [
    { id: 'fl', x: 30, y: 30, label: '' }, { id: 'fr', x: 70, y: 30, label: '' },
    { id: 'bl', x: 30, y: 70, label: '' }, { id: 'br', x: 70, y: 70, label: '' },
    { id: 'tl', x: 15, y: 15, label: '' }, { id: 'tr', x: 55, y: 15, label: '' },
    { id: 'dl', x: 15, y: 55, label: '' }, { id: 'dr', x: 55, y: 55, label: '' }
  ],
  edges: [
    { id: 'e1', n1: 'fl', n2: 'fr' }, { id: 'e2', n1: 'fr', n2: 'br' }, { id: 'e3', n1: 'br', n2: 'bl' }, { id: 'e4', n1: 'bl', n2: 'fl' },
    { id: 'e5', n1: 'tl', n2: 'tr' }, { id: 'e6', n1: 'tr', n2: 'dr' }, { id: 'e7', n1: 'dr', n2: 'dl' }, { id: 'e8', n1: 'dl', n2: 'tl' },
    { id: 'e9', n1: 'fl', n2: 'tl' }, { id: 'e10', n1: 'fr', n2: 'tr' }, { id: 'e11', n1: 'bl', n2: 'dl' }, { id: 'e12', n1: 'br', n2: 'dr' }
  ]
};
