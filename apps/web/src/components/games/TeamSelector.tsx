import type { Component } from 'solid-js';
import type { Team } from '../../types/game-event';

interface TeamSelectorProps {
  value: Team | '';
  onChange: (team: Team) => void;
  homeTeam: string;
  awayTeam: string;
}

const TeamSelector: Component<TeamSelectorProps> = (props) => {
  return (
    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => props.onChange('away')}
        class={`relative rounded-lg border-2 p-4 transition-all ${
          props.value === 'away'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span class="mb-1 block text-sm text-gray-500">Away</span>
        <span class="block font-semibold text-gray-900">{props.awayTeam}</span>
        {props.value === 'away' && (
          <div class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => props.onChange('home')}
        class={`relative rounded-lg border-2 p-4 transition-all ${
          props.value === 'home'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span class="mb-1 block text-sm text-gray-500">Home</span>
        <span class="block font-semibold text-gray-900">{props.homeTeam}</span>
        {props.value === 'home' && (
          <div class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default TeamSelector;
