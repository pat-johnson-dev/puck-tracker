import { supabase } from './supabase';
import type { Game, GameInsert } from '../types/game';
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
 * Updates a game's status
 */
export async function updateGameStatus(gameId: string, status: string): Promise<void> {
  const { error } = await supabase.from('game').update({ status }).eq('id', gameId);

  if (error) {
    console.error('Error updating game status:', error);
    throw new Error(`Failed to update game status: ${error.message}`);
  }
}

/**
 * Creates a new game event and updates game status to in_progress if needed
 */
export async function createGameEvent(
  event: GameEventInsert,
  currentGameStatus?: string
): Promise<GameEvent> {
  const { data, error } = await supabase.from('game_event').insert(event).select().single();

  if (error) {
    console.error('Error creating game event:', error);
    throw new Error(`Failed to create game event: ${error.message}`);
  }

  // Update game status to in_progress if it's currently "new"
  if (currentGameStatus === 'new' && event.game_id) {
    await updateGameStatus(event.game_id, 'in_progress');
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
