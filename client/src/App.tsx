import { Route, Router } from '@solidjs/router';
import { Component, lazy, ParentComponent } from 'solid-js';

const Home: Component = lazy(() => import('./pages/home'));
const Admin: Component = lazy(() => import('./pages/admin'));
const Teachers: Component = lazy(() => import('./pages/teachers'));
const NotFound: Component = lazy(() => import('./pages/not_found'));


const Layout: ParentComponent = (props) => {
  return (
    <>
      <header class='text-3xl text-center bg-transparent sticky top-0 p-2'>
        <h1>School Name</h1>
      </header>
      {props.children}
      <footer class='text-center absolute inset-x-0 bottom-0 p-2'>
        <hr></hr>
        <h1>Footer</h1>
      </footer>
    </>
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
