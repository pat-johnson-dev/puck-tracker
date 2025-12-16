import type { Team } from '../types/game-event';

// Event types for game logic calculations
export type GoalEvent = {
  type: 'goal';
  team: Team;
};

export type StopEvent = {
  type: 'stoppage';
};

export type FaceoffEvent = {
  type: 'faceoff';
};

export type GameEvent = GoalEvent | StopEvent | FaceoffEvent;

export type Score = {
  home: number;
  away: number;
};

/**
 * Calculate the current score from a list of game events
 */
export function calculateScore(events: GameEvent[]): Score {
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
