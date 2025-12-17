import type { Tables, TablesInsert, TablesUpdate } from './database';

// Base types from database
export type Game = Tables<'game'>;
export type GameInsert = TablesInsert<'game'>;
export type GameUpdate = TablesUpdate<'game'>;

export type Team = Tables<'team'>;
export type TeamInsert = TablesInsert<'team'>;

// Game with joined team data (for display)
export type GameWithTeams = Game & {
  home_team: Team;
  away_team: Team;
};

// Game status enum for type safety
export const GameStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];
