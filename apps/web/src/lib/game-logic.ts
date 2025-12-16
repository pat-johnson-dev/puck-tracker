import type { Team } from '../types/game-event';

// Event types for game logic calculations
export type GoalEvent = {
  type: 'goal';
  team: Team;
};

export type StopEvent = {
  type: 'stoppage';
  subtype?: string;
};

export type FaceoffEvent = {
  type: 'faceoff';
};

export type GameLogicEvent = GoalEvent | StopEvent | FaceoffEvent;

export type Score = {
  home: number;
  away: number;
};

/**
 * Calculate the current score from a list of game events
 */
export function calculateScore(events: GameLogicEvent[]): Score {
  return events.reduce(
    (score, event) => {
      if (event.type === 'goal') {
        return {
          home: score.home + (event.team === 'home' ? 1 : 0),
          away: score.away + (event.team === 'away' ? 1 : 0),
        };
      }
      return score;
    },
    { home: 0, away: 0 }
  );
}

/**
 * Determine the current period based on period_end events
 */
export function getCurrentPeriod(
  events: { event_type: string; event_subtype: string | null }[]
): number {
  const periodEndCount = events.filter(
    (e) => e.event_type === 'stoppage' && e.event_subtype === 'period_end'
  ).length;
  return periodEndCount + 1;
}
