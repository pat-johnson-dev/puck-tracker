import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import { Collapsible } from '@kobalte/core/collapsible';
import type { GameEvent } from '../../types/game-event';

interface GameEventListProps {
  events: GameEvent[];
}

// Helper to format event subtype for display
const formatSubtype = (subtype: string | null): string => {
  if (!subtype) return '';
  return subtype
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to generate event summary
const getEventSummary = (event: GameEvent): string => {
  const team = event.team ? ` - ${event.team.charAt(0).toUpperCase() + event.team.slice(1)}` : '';
  const subtype = formatSubtype(event.event_subtype);

  switch (event.event_type) {
    case 'stoppage':
      return `${subtype}${team}`;
    case 'goal':
      return `GOAL${team}`;
    case 'faceoff':
      return `Face-off${team}`;
    default:
      return event.event_type;
  }
};

// Helper to generate event details from JSON
const getEventDetails = (event: GameEvent): string => {
  const details = event.details as Record<string, unknown> | null;
  if (!details) return '';

  const parts: string[] = [];

  if (details.player) parts.push(`Player #${details.player}`);
  if (details.playerCarrying) parts.push(`Carrying: #${details.playerCarrying}`);
  if (details.playerOffside) parts.push(`Offside: #${details.playerOffside}`);
  if (details.penaltyType) parts.push(`Type: ${formatSubtype(details.penaltyType as string)}`);
  if (details.duration) parts.push(`Duration: ${details.duration} min`);
  if (details.penaltyShot) parts.push('Penalty Shot');
  if (details.reason) parts.push(`Reason: ${formatSubtype(details.reason as string)}`);

  return parts.join(' • ');
};

const GameEventList: Component<GameEventListProps> = (props) => {
  const getEventIcon = (eventType: string, _eventSubtype: string | null) => {
    switch (eventType) {
      case 'stoppage':
        return (
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M6.267 2.91a1 1 0 01.704-.29h6.058a1 1 0 01.704.29l4.267 4.267a1 1 0 01.29.704v6.058a1 1 0 01-.29.704l-4.267 4.267a1 1 0 01-.704.29H6.971a1 1 0 01-.704-.29L2 14.633a1 1 0 01-.29-.704V7.871a1 1 0 01.29-.704L6.267 2.91zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        );
      case 'goal':
        return (
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        );
      case 'faceoff':
        return (
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div class="overflow-hidden rounded-xl bg-white shadow-md">
      <div class="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 class="text-lg font-semibold text-gray-900">Game Events</h3>
      </div>

      <Show
        when={props.events.length > 0}
        fallback={<div class="px-4 py-8 text-center text-gray-500">No events recorded yet</div>}
      >
        <div class="divide-y divide-gray-100">
          <For each={props.events}>
            {(event) => (
              <Collapsible class="group">
                <Collapsible.Trigger class="flex w-full cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50">
                  {getEventIcon(event.event_type, event.event_subtype)}
                  <div class="flex-1 text-left">
                    <p class="font-medium text-gray-900">{getEventSummary(event)}</p>
                  </div>
                  <Show when={event.period || event.game_time}>
                    <div class="text-right text-sm text-gray-500">
                      <span class="font-mono">
                        {event.period ? `P${event.period}` : ''}
                        {event.period && event.game_time ? ' - ' : ''}
                        {event.game_time ?? ''}
                      </span>
                    </div>
                  </Show>
                  <svg
                    class="h-5 w-5 text-gray-400 transition-transform group-data-[expanded]:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Collapsible.Trigger>
                <Collapsible.Content class="data-[expanded]:animate-collapsible-down data-[closed]:animate-collapsible-up overflow-hidden">
                  <div class="bg-gray-50 px-4 py-3 pl-16 text-sm text-gray-600">
                    {getEventDetails(event) || 'No additional details'}
                  </div>
                </Collapsible.Content>
              </Collapsible>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default GameEventList;
