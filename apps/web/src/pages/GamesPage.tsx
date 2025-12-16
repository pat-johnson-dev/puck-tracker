import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Layout } from '../components/layout';
import { GamesGrid, AddGameDialog } from '../components/games';
import { createGame } from '../lib/games';
import type { GameInsert } from '../types/game';

const GamesPage: Component = () => {
  const [refetchGames, setRefetchGames] = createSignal<(() => void) | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = createSignal(false);

  const handleRefetch = (refetch: () => void) => {
    setRefetchGames(() => refetch);
  };

  const handleAddGame = async (game: GameInsert) => {
    try {
      await createGame(game);
      setIsAddDialogOpen(false);
      refetchGames()?.();
    } catch (error) {
      console.error('Failed to add game:', error);
      // TODO: Show error toast
    }
  };

  const HeaderActions = () => (
    <div class="flex items-center gap-3">
      <button
        onClick={() => refetchGames()?.()}
        class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
      <button
        onClick={() => setIsAddDialogOpen(true)}
        class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Game
      </button>
    </div>
  );

  return (
    <>
      <Layout actions={<HeaderActions />}>
        <GamesGrid onRefetch={handleRefetch} />
      </Layout>

      <AddGameDialog
        open={isAddDialogOpen()}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddGame}
      />
    </>
  );
};

export default GamesPage;
