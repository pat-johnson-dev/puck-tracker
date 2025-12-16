import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Dialog } from '@kobalte/core/dialog';
import type { GameInsert } from '../../types/game';

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (game: GameInsert) => void;
}

const AddGameDialog: Component<AddGameDialogProps> = (props) => {
  const getDefaultDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now.toTimeString().slice(0, 5);
  };

  const [homeTeam, setHomeTeam] = createSignal('');
  const [awayTeam, setAwayTeam] = createSignal('');
  const [location, setLocation] = createSignal('');
  const [startDate, setStartDate] = createSignal(getDefaultDate());
  const [startTime, setStartTime] = createSignal(getDefaultTime());

  const resetForm = () => {
    setHomeTeam('');
    setAwayTeam('');
    setLocation('');
    setStartDate(getDefaultDate());
    setStartTime(getDefaultTime());
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const game: GameInsert = {
      home_team: homeTeam(),
      away_team: awayTeam(),
      location: location() || null,
      start_date: startDate() || null,
      start_time: startTime() || null,
      status: 'new',
    };

    props.onSubmit(game);
    resetForm();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    props.onOpenChange(open);
  };

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="animate-fade-in fixed inset-0 bg-black/50" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content class="animate-scale-in w-full max-w-md rounded-lg bg-white shadow-xl">
            <div class="flex items-center justify-between border-b border-gray-200 p-4">
              <Dialog.Title class="text-lg font-semibold text-gray-900">Add New Game</Dialog.Title>
              <Dialog.CloseButton class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Dialog.CloseButton>
            </div>

            <form onSubmit={handleSubmit}>
              <div class="space-y-4 p-4">
                <div>
                  <label for="home-team" class="mb-1 block text-sm font-medium text-gray-700">
                    Home Team *
                  </label>
                  <input
                    id="home-team"
                    type="text"
                    required
                    value={homeTeam()}
                    onInput={(e) => setHomeTeam(e.currentTarget.value)}
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter home team name"
                  />
                </div>

                <div>
                  <label for="away-team" class="mb-1 block text-sm font-medium text-gray-700">
                    Away Team *
                  </label>
                  <input
                    id="away-team"
                    type="text"
                    required
                    value={awayTeam()}
                    onInput={(e) => setAwayTeam(e.currentTarget.value)}
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter away team name"
                  />
                </div>

                <div>
                  <label for="location" class="mb-1 block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location()}
                    onInput={(e) => setLocation(e.currentTarget.value)}
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter arena or location"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="start-date" class="mb-1 block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate()}
                      onInput={(e) => setStartDate(e.currentTarget.value)}
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label for="start-time" class="mb-1 block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      id="start-time"
                      type="time"
                      value={startTime()}
                      onInput={(e) => setStartTime(e.currentTarget.value)}
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 border-t border-gray-200 p-4">
                <Dialog.CloseButton
                  type="button"
                  class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                >
                  Cancel
                </Dialog.CloseButton>
                <button
                  type="submit"
                  class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Add Game
                </button>
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
};

export default AddGameDialog;
