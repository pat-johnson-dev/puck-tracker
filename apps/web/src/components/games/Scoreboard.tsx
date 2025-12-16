import type { Component } from 'solid-js';
import type { Game } from '../../types/game';

interface GameScoreboardProps {
  game: Game;
  awayScore?: number;
  homeScore?: number;
  period?: number;
  timeRemaining?: string;
}

const GameScoreboard: Component<GameScoreboardProps> = (props: GameScoreboardProps) => {
  const getPeriodDisplay = (period?: number): string => {
    if (!period || period === 0) return 'Not Started';
    if (period === 1) return '1st Period';
    if (period === 2) return '2nd Period';
    if (period === 3) return '3rd Period';
    if (period > 3) return `OT ${period - 3}`;
    return '';
  };

  return (
    <div class="rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white shadow-lg">
      <div class="flex items-center justify-between">
        {/* Away Team */}
        <div class="flex-1 text-center">
          <p class="mb-2 text-2xl font-bold">{props.game.away_team}</p>
          <p class="text-6xl font-bold tabular-nums">{props.awayScore ?? 0}</p>
        </div>

        {/* Period & Time */}
        <div class="flex-1 px-4 text-center">
          <p class="mb-2 text-lg tracking-wider text-gray-400 uppercase">
            {getPeriodDisplay(props.period)}
          </p>
          <p class="font-mono text-4xl font-bold tabular-nums">{props.timeRemaining ?? '20:00'}</p>
        </div>

        {/* Home Team */}
        <div class="flex-1 text-center">
          <p class="mb-2 text-2xl font-bold">{props.game.home_team}</p>
          <p class="text-6xl font-bold tabular-nums">{props.homeScore ?? 0}</p>
        </div>
      </div>

      {/* Game Info */}
      <div class="mt-6 flex items-center justify-center gap-6 border-t border-gray-700 pt-6 text-sm text-gray-400">
        {props.game.start_date && (
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(props.game.start_date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
        {props.game.location && (
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{props.game.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScoreboard;
