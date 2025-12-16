import type { Component, JSX } from 'solid-js';
import Navbar from './Navbar';

interface LayoutProps {
  children: JSX.Element;
  actions?: JSX.Element;
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div class="min-h-screen bg-gray-100">
      <Navbar actions={props.actions} />
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{props.children}</main>
    </div>
  );
};

export default Layout;
