import { Route, Router } from '@solidjs/router';
import { Component, lazy, ParentComponent } from 'solid-js';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

const Login: Component = lazy(() => import('./pages/login'));
const Home: Component = lazy(() => import('./pages/home'));
const Admin: Component = lazy(() => import('./pages/admin'));
const Teachers: Component = lazy(() => import('./pages/teachers'));
const Grades: Component = lazy(() => import('./pages/grades'));
const NotFound: Component = lazy(() => import('./pages/not_found'));


const Layout: ParentComponent = (props) => {
  return (
    <main class="mx-auto">
      <Header />
      <Navigation />
      {props.children}
      <Footer />
    </main>
  )
}


const App: Component = () => {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/login" component={Login} />
      <Route path="/grades" component={Grades} />
      <Route path="*404" component={NotFound} />
    </Router>
  )
}

export default App;
