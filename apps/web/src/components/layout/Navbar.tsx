import type { Component, JSX } from 'solid-js';

interface NavbarProps {
  actions?: JSX.Element;
}

const Navbar: Component<NavbarProps> = (props) => {
  return (
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            {/* Hockey Icon */}
            <svg class="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <h1 class="text-2xl font-bold text-gray-900">Puck Tracker</h1>
          </div>
          {props.actions}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
