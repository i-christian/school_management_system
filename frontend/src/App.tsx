import { Route, Router } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import User from './pages/dashboard/User';

const WrongPage: Component = lazy(() => import('./pages/404'));
const Dash: Component = lazy(() => import('./pages/Dashboard'));
const Home: Component = lazy(() => import('./pages/Home'));


const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dash}>
        <Route path="/:user" component={User} />
      </Route>
      <Route path="*404" component={WrongPage} />
    </Router>
  )
}

export default App;
