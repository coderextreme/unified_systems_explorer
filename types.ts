export enum NodeType {
  DOMAIN = 'DOMAIN',
  SYSTEM = 'SYSTEM',
  CONCEPT = 'CONCEPT',
  MODEL = 'MODEL',
  TOOL = 'TOOL'
}

export interface SystemNode {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  children?: SystemNode[];
  position?: { x: number; y: number };
}
