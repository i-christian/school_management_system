import { Route, Router } from '@solidjs/router';
import { Component, lazy, ParentComponent } from 'solid-js';
import Header from './components/Header';
import Footer from './components/Footer';

const Home: Component = lazy(() => import('./pages/home'));
const Admin: Component = lazy(() => import('./pages/admin'));
const Teachers: Component = lazy(() => import('./pages/teachers'));
const NotFound: Component = lazy(() => import('./pages/not_found'));


const Layout: ParentComponent = (props) => {
  return (
    <main class="mx-auto">
      <Header />
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
      <Route path="*404" component={NotFound} />
    </Router>
  )
}

export default App;
