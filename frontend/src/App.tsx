import { Route, Router } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Logout } from './pages/Logout';


const Admin: Component = lazy(() => import('./pages/users/Admin'));
const Home: Component = lazy(() => import('./pages/Home'));
const WrongPage: Component = lazy(() => import('./pages/404'));
const Protected: Component = lazy(() => import('./pages/Protected'));
const Users: Component = lazy(() => import('./pages/users/Users'));
const User: Component = lazy(() => import('./pages/users/User'));
const UserSettings: Component = lazy(() => import('./pages/users/UserSettings'));
const Students: Component = lazy(() => import('./pages/students/Students'));
const Student: Component = lazy(() => import('./pages/students/Student'));


const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/admin" component={Protected}>
        <Route path="/" component={Admin} />
      </Route>
      <Route path="/users" component={Protected}>
        <Route path="/" component={Users} />
        <Route path="/:id" component={User} />
      </Route>
      <Route path="/settings" component={Protected} >
        <Route path="/" component={UserSettings} />
      </Route>
      <Route path="/students" component={Protected}>
        <Route path="/" component={Students} />
        <Route path="/:id" component={Student} />
      </Route>

      <Route path="*404" component={WrongPage} />
    </Router >
  )
}

export default App;
