import { Route, Router } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import User from './pages/dashboard/User';
import Students from './pages/Students';
import Grades from './pages/students/Grades';

const WrongPage: Component = lazy(() => import('./pages/404'));
const Dashboard: Component = lazy(() => import('./pages/Dashboard'));
const Home: Component = lazy(() => import('./pages/Home'));


const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard}>
        <Route path="/" component={User} />
      </Route>
      <Route path="/students" component={Students}>
        <Route path="/" component={Grades} />
      </Route>
      <Route path="*404" component={WrongPage} />
    </Router>
  )
}

export default App;
