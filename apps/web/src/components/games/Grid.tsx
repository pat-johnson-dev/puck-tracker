import type { Component } from 'solid-js';
import { createResource, For, onMount, Show } from 'solid-js';
import { fetchRecentGames } from '../../lib/games';
import GameCard from './Card';

interface GamesGridProps {
  onRefetch?: (refetch: () => void) => void;
}

const GamesGrid: Component<GamesGridProps> = (props: GamesGridProps) => {
  const [games, { refetch }] = createResource(fetchRecentGames);

  // Expose refetch to parent on mount
  onMount(() => {
    props.onRefetch?.(refetch);
  });

  return (
    <>
      {/* Loading State */}
      <Show when={games.loading}>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={Array(6).fill(null)}>
            {() => (
              <div class="animate-pulse rounded-lg bg-white p-4 shadow-md">
                <div class="mb-4 h-4 w-16 rounded bg-gray-200" />
                <div class="mb-4 flex items-center justify-between">
                  <div class="h-6 w-20 rounded bg-gray-200" />
                  <div class="h-6 w-8 rounded bg-gray-200" />
                  <div class="h-6 w-20 rounded bg-gray-200" />
                </div>
                <div class="h-4 w-full rounded bg-gray-200" />
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Error State */}
      <Show when={games.error}>
        <div class="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <svg
            class="mx-auto mb-4 h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mb-2 text-lg font-medium text-red-800">Failed to load games</h3>
          <p class="mb-4 text-red-600">{games.error?.message}</p>
          <button
            onClick={() => refetch()}
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!games.loading && !games.error && games()?.length === 0}>
        <div class="rounded-lg bg-white p-12 text-center shadow-md">
          <svg
            class="mx-auto mb-4 h-16 w-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 class="mb-2 text-xl font-medium text-gray-900">No games yet</h3>
          <p class="text-gray-500">Get started by adding your first hockey game.</p>
        </div>
      </Show>

      {/* Games Grid */}
      <Show when={!games.loading && !games.error && (games()?.length ?? 0) > 0}>
        <div class="mb-4">
          <p class="text-sm text-gray-600">Showing {games()?.length} most recent games</p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={games()}>{(game) => <GameCard game={game} />}</For>
        </div>
      </Show>
    </>
  );
};

export default GamesGrid;
