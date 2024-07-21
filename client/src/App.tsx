import { Route, Router } from '@solidjs/router';
import { Component, lazy } from 'solid-js';

const Home: Component = lazy(() => import('./routes/home'));
const About: Component = lazy(() => import('./routes/about'));


const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  )
}

export default App;
