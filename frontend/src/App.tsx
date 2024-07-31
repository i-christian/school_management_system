import { Route, Router } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const WrongPage: Component = lazy(() => import('./pages/404'));
const Dash: Component = lazy(() => import('./pages/Dashboard'))


const App: Component = () => {
  return (
    <Router>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dash} />
      <Route path="*404" component={WrongPage} />
    </Router>
  )
}

export default App;
