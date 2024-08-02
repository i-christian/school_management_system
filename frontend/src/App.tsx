import { Route, Router } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import { Login } from './pages/Login';
import { Register } from './pages/Register'


const Admin: Component = lazy(() => import('./pages/users/Admin'));
const Home: Component = lazy(() => import('./pages/Home'));
const WrongPage: Component = lazy(() => import('./pages/404'));
const PageWrapper: Component = lazy(() => import('./pages/PageWrapper'));
const Users: Component = lazy(() => import('./pages/users/Users'));
const User: Component = lazy(() => import('./pages/users/User'));


const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={PageWrapper}>
        <Route path="/" component={Admin} />
      </Route>
      <Route path="/users" component={PageWrapper}>
        <Route path="/" component={Users} />
        <Route path="/:id" component={User} />
      </Route>
      <Route path="*404" component={WrongPage} />
    </Router>
  )
}

export default App;
