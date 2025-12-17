import { supabase } from './supabase';
import type { Game, GameInsert, Team, TeamInsert } from '../types/game';
import type { GameEvent, GameEventInsert } from '../types/game-event';

/**
 * Fetches the 10 most recent games sorted by start_date and start_time (descending)
 */
export async function fetchRecentGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('start_time', { ascending: false, nullsFirst: false })
    .limit(10);

  if (error) {
    console.error('Error fetching games:', error);
    throw new Error(`Failed to fetch games: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetches a single game by ID
 */
export async function fetchGameById(id: string): Promise<Game | null> {
  const { data, error } = await supabase.from('game').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching game:', error);
    throw new Error(`Failed to fetch game: ${error.message}`);
  }

  return data;
}

/**
 * Creates a new game
 */
export async function createGame(game: GameInsert): Promise<Game> {
  const { data, error } = await supabase.from('game').insert(game).select().single();

  if (error) {
    console.error('Error creating game:', error);
    throw new Error(`Failed to create game: ${error.message}`);
  }

  return data;
}

/**
 * Creates a new game event
 */
export async function createGameEvent(event: GameEventInsert): Promise<GameEvent> {
  const { data, error } = await supabase.from('game_event').insert(event).select().single();

  if (error) {
    console.error('Error creating game event:', error);
    throw new Error(`Failed to create game event: ${error.message}`);
  }

  return data;
}

/**
 * Fetches all events for a game, ordered by id descending (most recent first)
 */
export async function fetchGameEvents(gameId: string): Promise<GameEvent[]> {
  const { data, error } = await supabase
    .from('game_event')
    .select('*')
    .eq('game_id', gameId)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching game events:', error);
    throw new Error(`Failed to fetch game events: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Fetches all teams
 */
export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from('team').select('*').order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Creates a new team
 */
export async function createTeam(team: TeamInsert): Promise<Team> {
  const { data, error } = await supabase.from('team').insert(team).select().single();

  if (error) {
    console.error('Error creating team:', error);
    throw new Error(`Failed to create team: ${error.message}`);
  }

  return data ?? [];
}
