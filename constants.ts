
import type { SystemNode } from './types';
import { NodeType } from './types';

export const systemsData: SystemNode[] = [
  {
    id: '1',
    name: 'Systems Science',
    type: NodeType.DOMAIN,
    description: 'The interdisciplinary study of systems.',
    children: [
      {
        id: '1-1',
        name: 'Information Modeling',
        type: NodeType.SYSTEM,
        description: 'Represents information structures in a formal way.',
        children: [
          { id: '1-1-1', name: 'Entity-Relationship Model', type: NodeType.MODEL, description: 'A data model for describing the data or information aspects of a business domain.' },
          { id: '1-1-2', name: 'Semantic Networks', type: NodeType.MODEL, description: 'A knowledge base that represents semantic relations between concepts.' },
          { id: '1-1-3', name: 'Mind Maps', type: NodeType.TOOL, description: 'A diagram used to visually organize information.' },
        ],
      },
      {
        id: '1-2',
        name: 'Product Lifecycle Management',
        type: NodeType.SYSTEM,
        description: 'The process of managing the entire lifecycle of a product.',
        children: [
          { id: '1-2-1', name: 'Product Filtering', type: NodeType.CONCEPT, description: 'Allowing users to narrow down product searches based on specific criteria.' },
          { id: '1-2-2', name: 'Product Configuration', type: NodeType.CONCEPT, description: 'The process of customizing a product to meet specific customer requirements.' },
          { id: '1-2-3', name: 'Inventory Management', type: NodeType.CONCEPT, description: 'Supervising non-capitalized assets (inventory) and stock items.' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Digital Environments',
    type: NodeType.DOMAIN,
    description: 'Virtual and interactive spaces.',
    children: [
      {
        id: '2-1',
        name: '3D/4D Interfaces',
        type: NodeType.SYSTEM,
        description: 'Interfaces that operate in three spatial dimensions plus time.',
        children: [
          { id: '2-1-1', name: '3D Skeleton Animation', type: NodeType.MODEL, description: 'A technique in computer animation in which a character is represented in two parts: a surface representation and a hierarchical set of interconnected parts.' },
          { id: '2-1-2', name: 'Time Series Visualization', type: NodeType.CONCEPT, description: 'Displaying data points in successive order over time.' },
          { id: '2-1-3', name: 'Virtual Space Leasing', type: NodeType.CONCEPT, description: 'Renting or leasing digital real estate in virtual worlds.' },
        ],
      },
      {
        id: '2-2',
        name: 'UI & Application Structure',
        type: NodeType.SYSTEM,
        description: 'The structure of user interfaces and applications.',
        children: [
          { id: '2-2-1', name: 'Windowing Systems', type: NodeType.TOOL, description: 'A software component that implements window managers and provides support for graphics hardware.' },
          { id: '2-2-2', name: 'DOM Manipulation', type: NodeType.CONCEPT, description: 'Interacting with the Document Object Model of an HTML page.' },
          { id: '2-2-3', name: 'File System Browsing', type: NodeType.TOOL, description: 'Navigating a hierarchical file system.' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Social & Business Systems',
    type: NodeType.DOMAIN,
    description: 'Systems for human interaction and commerce.',
    children: [
      {
        id: '3-1',
        name: 'Human Resources',
        type: NodeType.SYSTEM,
        description: 'Systems for managing employees and recruitment.',
        children: [
          { id: '3-1-1', name: 'Resume & Cover Letter Analysis', type: NodeType.CONCEPT, description: 'Automated parsing and analysis of job application documents.' },
          { id: '3-1-2', name: 'Interview Scheduling', type: NodeType.TOOL, description: 'Tools for coordinating and scheduling job interviews.' },
        ],
      },
      {
        id: '3-2',
        name: 'Interpersonal Connections',
        type: NodeType.SYSTEM,
        description: 'Systems for managing contacts and relationships.',
        children: [
          { id: '3-2-1', name: 'Contact Management', type: NodeType.TOOL, description: 'Software for storing and managing contact information.' },
          { id: '3-2-2', name: 'Meeting Coordination', type: NodeType.CONCEPT, description: 'The process of organizing and scheduling meetings.' },
        ],
      },
    ],
  },
];
