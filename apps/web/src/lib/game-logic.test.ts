import { describe, it, expect } from 'vitest';
import { calculateScore } from './game-logic';

describe('calculateScore', () => {
  it('returns 0-0 when there are no events', () => {
    expect(calculateScore([])).toEqual({ home: 0, away: 0 });
  });

  it('counts a home team goal', () => {
    const events = [{ type: 'goal' as const, team: 'home' as const }];
    expect(calculateScore(events)).toEqual({ home: 1, away: 0 });
  });

  it('counts an away team goal', () => {
    const events = [{ type: 'goal' as const, team: 'away' as const }];
    expect(calculateScore(events)).toEqual({ home: 0, away: 1 });
  });

  it('counts multiple goals from both teams', () => {
    const events = [
      { type: 'goal' as const, team: 'home' as const },
      { type: 'goal' as const, team: 'away' as const },
      { type: 'goal' as const, team: 'home' as const },
      { type: 'goal' as const, team: 'away' as const },
      { type: 'goal' as const, team: 'home' as const },
    ];
    expect(calculateScore(events)).toEqual({ home: 3, away: 2 });
  });

  it('ignores non-goal events', () => {
    const events = [
      { type: 'goal' as const, team: 'home' as const },
      { type: 'stoppage' as const },
      { type: 'faceoff' as const },
      { type: 'goal' as const, team: 'away' as const },
    ];
    expect(calculateScore(events)).toEqual({ home: 1, away: 1 });
  });
});
