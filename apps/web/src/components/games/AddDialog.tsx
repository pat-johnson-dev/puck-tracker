import type { Component } from 'solid-js';
import { createSignal, createResource, Show, For } from 'solid-js';
import { Dialog } from '@kobalte/core/dialog';
import { fetchTeams, createTeam } from '../../lib/games';
import type { GameInsert, Team } from '../../types/game';

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (game: GameInsert) => void;
}

const AddGameDialog: Component<AddGameDialogProps> = (props) => {
  const [teams, { refetch: refetchTeams }] = createResource(fetchTeams);

  const [homeTeamId, setHomeTeamId] = createSignal('');
  const [awayTeamId, setAwayTeamId] = createSignal('');
  const [location, setLocation] = createSignal('');
  const [startDate, setStartDate] = createSignal('');
  const [startTime, setStartTime] = createSignal('');

  // New team creation
  const [showNewHomeTeam, setShowNewHomeTeam] = createSignal(false);
  const [showNewAwayTeam, setShowNewAwayTeam] = createSignal(false);
  const [newHomeTeamName, setNewHomeTeamName] = createSignal('');
  const [newAwayTeamName, setNewAwayTeamName] = createSignal('');

  const getDefaultDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now.toTimeString().slice(0, 5);
  };

  const resetForm = () => {
    setHomeTeamId('');
    setAwayTeamId('');
    setLocation('');
    setStartDate(getDefaultDate());
    setStartTime(getDefaultTime());
    setShowNewHomeTeam(false);
    setShowNewAwayTeam(false);
    setNewHomeTeamName('');
    setNewAwayTeamName('');
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm();
      refetchTeams();
    }
    props.onOpenChange(open);
  };

  const handleCreateHomeTeam = async () => {
    if (!newHomeTeamName().trim()) return;
    try {
      const team = await createTeam({ name: newHomeTeamName().trim() });
      await refetchTeams();
      setHomeTeamId(team.id);
      setShowNewHomeTeam(false);
      setNewHomeTeamName('');
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleCreateAwayTeam = async () => {
    if (!newAwayTeamName().trim()) return;
    try {
      const team = await createTeam({ name: newAwayTeamName().trim() });
      await refetchTeams();
      setAwayTeamId(team.id);
      setShowNewAwayTeam(false);
      setNewAwayTeamName('');
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const game: GameInsert = {
      home_team_id: homeTeamId(),
      away_team_id: awayTeamId(),
      location: location() || null,
      start_date: startDate() || null,
      start_time: startTime() || null,
      status: 'new',
    };

    props.onSubmit(game);
    resetForm();
  };

  const canSubmit = () => homeTeamId() && awayTeamId();

  const TeamSelect = (props: {
    label: string;
    value: string;
    onChange: (id: string) => void;
    showNew: boolean;
    setShowNew: (show: boolean) => void;
    newName: string;
    setNewName: (name: string) => void;
    onCreateNew: () => void;
    teams: Team[];
  }) => (
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">{props.label} *</label>
      <Show
        when={!props.showNew}
        fallback={
          <div class="flex gap-2">
            <input
              type="text"
              value={props.newName}
              onInput={(e) => props.setNewName(e.currentTarget.value)}
              class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter team name"
            />
            <button
              type="button"
              onClick={props.onCreateNew}
              class="rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => props.setShowNew(false)}
              class="rounded-lg bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        }
      >
        <div class="flex gap-2">
          <select
            value={props.value}
            onChange={(e) => props.onChange(e.currentTarget.value)}
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select team</option>
            <For each={props.teams}>{(team) => <option value={team.id}>{team.name}</option>}</For>
          </select>
          <button
            type="button"
            onClick={() => props.setShowNew(true)}
            class="rounded-lg bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200"
            title="Add new team"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </Show>
    </div>
  );

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
                <TeamSelect
                  label="Home Team"
                  value={homeTeamId()}
                  onChange={setHomeTeamId}
                  showNew={showNewHomeTeam()}
                  setShowNew={setShowNewHomeTeam}
                  newName={newHomeTeamName()}
                  setNewName={setNewHomeTeamName}
                  onCreateNew={handleCreateHomeTeam}
                  teams={teams() ?? []}
                />

                <TeamSelect
                  label="Away Team"
                  value={awayTeamId()}
                  onChange={setAwayTeamId}
                  showNew={showNewAwayTeam()}
                  setShowNew={setShowNewAwayTeam}
                  newName={newAwayTeamName()}
                  setNewName={setNewAwayTeamName}
                  onCreateNew={handleCreateAwayTeam}
                  teams={teams() ?? []}
                />

                <div>
                  <label class="mb-1 block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={location()}
                    onInput={(e) => setLocation(e.currentTarget.value)}
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter arena or location"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={startDate()}
                      onInput={(e) => setStartDate(e.currentTarget.value)}
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      value={startTime()}
                      onInput={(e) => setStartTime(e.currentTarget.value)}
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 border-t border-gray-200 p-4">
                <Dialog.CloseButton
                  type="button"
                  class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </Dialog.CloseButton>
                <button
                  type="submit"
                  disabled={!canSubmit()}
                  class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
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
