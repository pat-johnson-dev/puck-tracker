import type { Component } from 'solid-js';

interface EventButtonBarProps {
  onStop?: () => void;
  onGoal?: () => void;
  onFaceoff?: () => void;
}

const EventButtonBar: Component<EventButtonBarProps> = (props: EventButtonBarProps) => {
  return (
    <div class="rounded-xl bg-white p-4 shadow-md">
      <div class="flex items-center justify-center gap-4">
        <button
          onClick={() => props.onStop?.()}
          class="flex max-w-48 flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-4 font-semibold text-white transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
          Stop
        </button>

        <button
          onClick={() => props.onGoal?.()}
          class="flex max-w-48 flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Goal
        </button>

        <button
          onClick={() => props.onFaceoff?.()}
          class="flex max-w-48 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Face-off
        </button>
      </div>
    </div>
  );
};

export default EventButtonBar;
