import type { Component } from 'solid-js';
import { A } from '@solidjs/router';
import type { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
}

const GameCard: Component<GameCardProps> = (props) => {
  // Format date for display
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timeStr: string | null): string => {
    if (!timeStr) return 'TBD';
    // Parse time string (e.g., "19:00:00+00")
    const [timePart] = timeStr.split('+');
    const [hours, minutes] = timePart.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string | null): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <A
      href={`/game/${props.game.id}`}
      class="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
    >
      {/* Status Badge */}
      <div class="px-4 pt-4">
        <span
          class={`inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusColor(props.game.status)}`}
        >
          {props.game.status?.replace('_', ' ') ?? 'Unknown'}
        </span>
      </div>

      {/* Teams */}
      <div class="px-4 py-4">
        <div class="flex items-center justify-center gap-2">
          <span class="flex-1 text-right text-xl font-bold text-gray-900">
            {props.game.away_team}
          </span>
          <span class="text-xl text-gray-400">@</span>
          <span class="flex-1 text-left text-xl font-bold text-gray-900">
            {props.game.home_team}
          </span>
        </div>
      </div>

      {/* Game Details */}
      <div class="border-t border-gray-100 bg-gray-50 px-4 py-3">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(props.game.start_date)}</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatTime(props.game.start_time)}</span>
          </div>
        </div>
        {props.game.location && (
          <div class="mt-2 flex items-center gap-1 text-sm text-gray-500">
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
    </A>
  );
};

export default GameCard;
