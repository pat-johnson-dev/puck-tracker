import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { GamesPage } from './pages';
import { GameEditPage } from './components/games';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={GamesPage} />
      <Route path="/game/:id" component={GameEditPage} />
    </Router>
  );
};

export default App;
