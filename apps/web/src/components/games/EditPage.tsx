import type { Component } from 'solid-js';
import { createResource, createSignal, Show } from 'solid-js';
import { A, useParams } from '@solidjs/router';
import { fetchGameById, fetchGameEvents, createGameEvent } from '../../lib/games';
import { Layout } from '../layout';
import GameScoreboard from './Scoreboard';
import EventButtonBar from './EventButtonBar';
import GameEventList from './EventList';
import StoppageDialog from './StoppageDialog';
import type { GameEventInsert } from '../../types/game-event';

const GameEditPage: Component = () => {
  const params = useParams<{ id: string }>();
  const [game] = createResource(() => params.id, fetchGameById);
  const [events, { refetch: refetchEvents }] = createResource(() => params.id, fetchGameEvents);
  const [isStoppageDialogOpen, setIsStoppageDialogOpen] = createSignal(false);

  const handleStop = () => {
    setIsStoppageDialogOpen(true);
  };

  const handleGoal = () => {
    // TODO: Open goal event modal
    console.log('Goal clicked');
  };

  const handleFaceoff = () => {
    // TODO: Open face-off event modal
    console.log('Face-off clicked');
  };

  const handleStoppageSave = async (event: GameEventInsert) => {
    try {
      await createGameEvent(event);
      refetchEvents();
    } catch (error) {
      console.error('Failed to save stoppage:', error);
    }
  };

  const handleStoppageSaveAndFaceoff = async (event: GameEventInsert) => {
    try {
      await createGameEvent(event);
      refetchEvents();
      // TODO: Open faceoff modal
      console.log('Opening faceoff modal...');
    } catch (error) {
      console.error('Failed to save stoppage:', error);
    }
  };

  const BackButton = () => (
    <A
      href="/"
      class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Games
    </A>
  );

  return (
    <>
      <Layout actions={<BackButton />}>
        {/* Loading State */}
        <Show when={game.loading}>
          <div class="space-y-6">
            <div class="animate-pulse rounded-xl bg-gray-800 p-8">
              <div class="flex items-center justify-between">
                <div class="flex-1 text-center">
                  <div class="mx-auto mb-2 h-8 w-32 rounded bg-gray-700" />
                  <div class="mx-auto h-16 w-16 rounded bg-gray-700" />
                </div>
                <div class="flex-1 text-center">
                  <div class="mx-auto mb-2 h-6 w-24 rounded bg-gray-700" />
                  <div class="mx-auto h-10 w-20 rounded bg-gray-700" />
                </div>
                <div class="flex-1 text-center">
                  <div class="mx-auto mb-2 h-8 w-32 rounded bg-gray-700" />
                  <div class="mx-auto h-16 w-16 rounded bg-gray-700" />
                </div>
              </div>
            </div>
            <div class="animate-pulse rounded-xl bg-white p-4">
              <div class="flex justify-center gap-4">
                <div class="h-14 w-40 rounded-lg bg-gray-200" />
                <div class="h-14 w-40 rounded-lg bg-gray-200" />
                <div class="h-14 w-40 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </Show>

        {/* Error State */}
        <Show when={game.error}>
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
            <h3 class="mb-2 text-lg font-medium text-red-800">Failed to load game</h3>
            <p class="mb-4 text-red-600">{game.error?.message}</p>
            <A
              href="/"
              class="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Return to Games
            </A>
          </div>
        </Show>

        {/* Game Not Found */}
        <Show when={!game.loading && !game.error && !game()}>
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mb-2 text-xl font-medium text-gray-900">Game not found</h3>
            <p class="mb-4 text-gray-500">
              The game you're looking for doesn't exist or has been removed.
            </p>
            <A
              href="/"
              class="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Return to Games
            </A>
          </div>
        </Show>

        {/* Game Edit Content */}
        <Show when={!game.loading && !game.error && game()}>
          <div class="space-y-6">
            {/* Scoreboard */}
            <GameScoreboard
              game={game()!}
              awayScore={0}
              homeScore={0}
              period={0}
              timeRemaining="20:00"
            />

            {/* Event Buttons */}
            <EventButtonBar onStop={handleStop} onGoal={handleGoal} onFaceoff={handleFaceoff} />

            {/* Event List */}
            <GameEventList events={events() ?? []} />
          </div>
        </Show>
      </Layout>

      {/* Stoppage Dialog */}
      <Show when={game()}>
        <StoppageDialog
          open={isStoppageDialogOpen()}
          gameId={game()!.id}
          homeTeam={game()!.home_team}
          awayTeam={game()!.away_team}
          onOpenChange={setIsStoppageDialogOpen}
          onSave={handleStoppageSave}
          onSaveAndFaceoff={handleStoppageSaveAndFaceoff}
        />
      </Show>
    </>
  );
};

export default GameEditPage;
