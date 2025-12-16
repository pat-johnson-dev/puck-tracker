import type { Tables, TablesInsert, TablesUpdate } from './database';

// Use generated types from Supabase
export type Game = Tables<'game'>;
export type GameInsert = TablesInsert<'game'>;
export type GameUpdate = TablesUpdate<'game'>;

// Game status enum for type safety (keep this for convenience)
export const GameStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];
