import type { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { id: 'code-test', label: 'Code Test', color: '#4caf50' },
  { id: 'react', label: 'React', color: '#61dafb' },
  { id: 'cs', label: 'CS 기초', color: '#9c27b0' },
  { id: 'network', label: 'Network', color: '#ff5722' },
  { id: 'etc', label: '기타', color: '#607d8b' },
];

export function getCategoryById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#607d8b' };
}
