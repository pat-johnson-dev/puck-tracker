import type { Component } from 'solid-js';
import { createSignal, Show, For } from 'solid-js';
import { Dialog } from '@kobalte/core/dialog';
import type {
  Team,
  StoppageSubtypeValue,
  StoppageDetails,
  OtherStoppageReasonValue,
  PenaltyTypeValue,
  GameEventInsert,
} from '../../types/game-event';
import { StoppageSubtype } from '../../types/game-event';
import TeamSelector from './TeamSelector';

interface StoppageDialogProps {
  open: boolean;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  currentPeriod: number;
  onOpenChange: (open: boolean) => void;
  onSave: (event: GameEventInsert) => void;
  onSaveAndFaceoff: (event: GameEventInsert) => void;
}

type Step = 'select-type' | 'details';

const stoppageTypeLabels: Record<StoppageSubtypeValue, string> = {
  offside: 'Offside',
  icing: 'Icing',
  penalty: 'Penalty',
  period_end: 'Period/Game End',
  game_end: 'Game End',
  other: 'Other',
};

const otherReasonLabels: Record<OtherStoppageReasonValue, string> = {
  injury: 'Injury',
  puck_out_of_play: 'Puck Out of Play',
  net_dislodged: 'Net Dislodged',
  high_stick: 'High Stick (non-penalty)',
  hand_pass: 'Hand Pass',
  goalie_cover: 'Goalie Cover',
};

const penaltyTypeLabels: Record<PenaltyTypeValue, string> = {
  tripping: 'Tripping',
  hooking: 'Hooking',
  slashing: 'Slashing',
  holding: 'Holding',
  interference: 'Interference',
  roughing: 'Roughing',
  high_sticking: 'High Sticking',
  cross_checking: 'Cross Checking',
  boarding: 'Boarding',
  charging: 'Charging',
  delay_of_game: 'Delay of Game',
  too_many_men: 'Too Many Men',
  other: 'Other',
};

const StoppageDialog: Component<StoppageDialogProps> = (props) => {
  const [step, setStep] = createSignal<Step>('select-type');
  const [selectedType, setSelectedType] = createSignal<StoppageSubtypeValue | null>(null);

  // Form fields
  const [team, setTeam] = createSignal<Team | ''>('');
  const [player, setPlayer] = createSignal('');
  const [playerCarrying, setPlayerCarrying] = createSignal('');
  const [playerOffside, setPlayerOffside] = createSignal('');
  const [penaltyType, setPenaltyType] = createSignal<PenaltyTypeValue | ''>('');
  const [penaltyDuration, setPenaltyDuration] = createSignal<number | ''>('');
  const [penaltyShot, setPenaltyShot] = createSignal(false);
  const [otherReason, setOtherReason] = createSignal<OtherStoppageReasonValue | ''>('');
  const [period, setPeriod] = createSignal<number | ''>(props.currentPeriod);
  const [gameTime, setGameTime] = createSignal('');

  const resetForm = () => {
    setStep('select-type');
    setSelectedType(null);
    setTeam('');
    setPlayer('');
    setPlayerCarrying('');
    setPlayerOffside('');
    setPenaltyType('');
    setPenaltyDuration('');
    setPenaltyShot(false);
    setOtherReason('');
    setPeriod(props.currentPeriod);
    setGameTime('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    props.onOpenChange(open);
  };

  const handleTypeSelect = (type: StoppageSubtypeValue) => {
    setSelectedType(type);
    setStep('details');
  };

  const buildEventDetails = (): StoppageDetails | null => {
    const type = selectedType();
    if (!type) return null;

    switch (type) {
      case 'offside':
        return {
          playerCarrying: playerCarrying() || undefined,
          playerOffside: playerOffside() || undefined,
        };
      case 'icing':
        return {
          player: player() || undefined,
        };
      case 'penalty':
        return {
          player: player() || undefined,
          penaltyType: penaltyType() || undefined,
          duration: penaltyDuration() || undefined,
          penaltyShot: penaltyShot() || undefined,
        };
      case 'period_end':
      case 'game_end':
        return {
          confirmed: true,
        };
      case 'other':
        return {
          reason: otherReason() as OtherStoppageReasonValue,
          player: player() || undefined,
        };
      default:
        return null;
    }
  };

  const buildEvent = (): GameEventInsert => {
    return {
      game_id: props.gameId,
      event_type: 'stoppage',
      event_subtype: selectedType(),
      team: team() || null,
      period: period() || null,
      game_time: gameTime() || null,
      details: buildEventDetails(),
    };
  };

  const handleSave = () => {
    props.onSave(buildEvent());
    handleOpenChange(false);
  };

  const handleSaveAndFaceoff = () => {
    props.onSaveAndFaceoff(buildEvent());
    handleOpenChange(false);
  };

  const handleBack = () => {
    setStep('select-type');
  };

  // Check if "Other" type needs a reason selected before saving
  const canSave = () => {
    const type = selectedType();
    if (type === 'other' && !otherReason()) return false;
    return true;
  };

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="animate-fade-in fixed inset-0 bg-black/50" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content class="animate-scale-in w-full max-w-lg rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div class="flex items-center justify-between border-b border-gray-200 p-4">
              <Dialog.Title class="text-lg font-semibold text-gray-900">
                <Show when={step() === 'select-type'}>Record Stoppage</Show>
                <Show when={step() === 'details'}>
                  {stoppageTypeLabels[selectedType()!]} Details
                </Show>
              </Dialog.Title>
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

            {/* Content */}
            <div class="p-4">
              {/* Step 1: Select Type */}
              <Show when={step() === 'select-type'}>
                <div class="grid grid-cols-2 gap-3">
                  <For each={Object.entries(StoppageSubtype).filter(([_, v]) => v !== 'game_end')}>
                    {([_, value]) => (
                      <button
                        onClick={() => handleTypeSelect(value)}
                        class="rounded-lg border-2 border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
                      >
                        <span class="font-medium text-gray-900">{stoppageTypeLabels[value]}</span>
                      </button>
                    )}
                  </For>
                </div>
              </Show>

              {/* Step 2: Details */}
              <Show when={step() === 'details'}>
                <div class="space-y-4">
                  {/* Back button */}
                  <button
                    onClick={handleBack}
                    class="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>

                  {/* Offside fields */}
                  <Show when={selectedType() === 'offside'}>
                    <div class="space-y-4">
                      <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">Team</label>
                        <TeamSelector
                          value={team()}
                          onChange={setTeam}
                          homeTeam={props.homeTeam}
                          awayTeam={props.awayTeam}
                        />
                      </div>
                      <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">
                          Player # Carrying
                        </label>
                        <input
                          type="text"
                          value={playerCarrying()}
                          onInput={(e) => setPlayerCarrying(e.currentTarget.value)}
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Jersey number"
                        />
                      </div>
                      <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">
                          Player # Offside
                        </label>
                        <input
                          type="text"
                          value={playerOffside()}
                          onInput={(e) => setPlayerOffside(e.currentTarget.value)}
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Jersey number"
                        />
                      </div>
                    </div>
                  </Show>

                  {/* Icing fields */}
                  <Show when={selectedType() === 'icing'}>
                    <div class="space-y-4">
                      <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">Team</label>
                        <TeamSelector
                          value={team()}
                          onChange={setTeam}
                          homeTeam={props.homeTeam}
                          awayTeam={props.awayTeam}
                        />
                      </div>
                      <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">Player #</label>
                        <input
                          type="text"
                          value={player()}
                          onInput={(e) => setPlayer(e.currentTarget.value)}
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Jersey number"
                        />
                      </div>
                    </div>
                  </Show>

                  {/* Penalty fields */}
                  <Show when={selectedType() === 'penalty'}>
                    <div class="space-y-4">
                      <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">Team</label>
                        <TeamSelector
                          value={team()}
                          onChange={setTeam}
                          homeTeam={props.homeTeam}
                          awayTeam={props.awayTeam}
                        />
                      </div>
                      <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">Player #</label>
                        <input
                          type="text"
                          value={player()}
                          onInput={(e) => setPlayer(e.currentTarget.value)}
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Jersey number"
                        />
                      </div>
                      <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">
                          Penalty Type
                        </label>
                        <select
                          value={penaltyType()}
                          onChange={(e) =>
                            setPenaltyType(e.currentTarget.value as PenaltyTypeValue)
                          }
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="">Select penalty</option>
                          <For each={Object.entries(penaltyTypeLabels)}>
                            {([value, label]) => <option value={value}>{label}</option>}
                          </For>
                        </select>
                      </div>
                      <div class="flex gap-4">
                        <div class="flex-1">
                          <label class="mb-1 block text-sm font-medium text-gray-700">
                            Duration (min)
                          </label>
                          <input
                            type="number"
                            value={penaltyDuration()}
                            onInput={(e) =>
                              setPenaltyDuration(parseInt(e.currentTarget.value) || '')
                            }
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="2"
                            min="0"
                          />
                        </div>
                        <div class="flex items-end pb-2">
                          <label class="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={penaltyShot()}
                              onChange={(e) => setPenaltyShot(e.currentTarget.checked)}
                              class="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span class="text-sm font-medium text-gray-700">Penalty Shot</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </Show>

                  {/* Period/Game End fields */}
                  <Show when={selectedType() === 'period_end'}>
                    <div class="py-4 text-center">
                      <p class="mb-4 text-gray-600">
                        Are you sure you want to end the current period?
                      </p>
                    </div>
                  </Show>

                  {/* Other stoppage fields */}
                  <Show when={selectedType() === 'other'}>
                    <div class="space-y-4">
                      <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">Reason</label>
                        <select
                          value={otherReason()}
                          onChange={(e) =>
                            setOtherReason(e.currentTarget.value as OtherStoppageReasonValue)
                          }
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="">Select reason</option>
                          <For each={Object.entries(otherReasonLabels)}>
                            {([value, label]) => <option value={value}>{label}</option>}
                          </For>
                        </select>
                      </div>
                      <Show when={otherReason() === 'injury'}>
                        <div>
                          <label class="mb-1 block text-sm font-medium text-gray-700">
                            Player # Injured
                          </label>
                          <input
                            type="text"
                            value={player()}
                            onInput={(e) => setPlayer(e.currentTarget.value)}
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Jersey number"
                          />
                        </div>
                      </Show>
                    </div>
                  </Show>

                  {/* Optional: Period and Time (shown for all types except period_end) */}
                  <Show when={selectedType() !== 'period_end'}>
                    <div class="border-t border-gray-200 pt-4">
                      <p class="mb-3 text-sm text-gray-500">Optional: When did this occur?</p>
                      <div class="flex gap-4">
                        <div class="flex-1">
                          <label class="mb-1 block text-sm font-medium text-gray-700">Period</label>
                          <select
                            value={period()}
                            onChange={(e) => setPeriod(parseInt(e.currentTarget.value) || '')}
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="">Select</option>
                            <option value="1">1st</option>
                            <option value="2">2nd</option>
                            <option value="3">3rd</option>
                            <option value="4">OT</option>
                          </select>
                        </div>
                        <div class="flex-1">
                          <label class="mb-1 block text-sm font-medium text-gray-700">
                            Time Remaining
                          </label>
                          <input
                            type="text"
                            value={gameTime()}
                            onInput={(e) => setGameTime(e.currentTarget.value)}
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="12:34"
                          />
                        </div>
                      </div>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>

            {/* Footer */}
            <Show when={step() === 'details'}>
              <div class="flex items-center justify-end gap-3 border-t border-gray-200 p-4">
                <Dialog.CloseButton class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                  Cancel
                </Dialog.CloseButton>
                <button
                  onClick={handleSave}
                  disabled={!canSave()}
                  class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Save & Close
                </button>
                <button
                  onClick={handleSaveAndFaceoff}
                  disabled={!canSave()}
                  class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Save & Faceoff
                </button>
              </div>
            </Show>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
};

export default StoppageDialog;
