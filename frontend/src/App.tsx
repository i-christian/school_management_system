import { Route, Router } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";

const Admin: Component = lazy(() => import("./pages/users/Admin"));
const Home: Component = lazy(() => import("./pages/Home"));
const DashboardPage: Component = lazy(() => import("./pages/DashoardPage"));
const Forbidden: Component = lazy(() => import("./pages/403"));
const WrongPage: Component = lazy(() => import("./pages/404"));
const AdminProtected: Component = lazy(() => import("./pages/AdminProtected"));
const UserProtected: Component = lazy(() => import("./pages/UserProtected"));
const Teachers: Component = lazy(() => import("./pages/users/Teachers"));
const UserSettings: Component = lazy(
  () => import("./pages/users/UserSettings")
);
const Grades: Component = lazy(() => import("./pages/grades/Grades"));

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />

      <Route path="/admin" component={AdminProtected}>
        <Route path="/" component={Admin} />
      </Route>

      <Route path="/teachers" component={UserProtected}>
        <Route path="/" component={Teachers} />
      </Route>

      <Route path="/settings" component={UserProtected}>
        <Route path="/" component={UserSettings} />
      </Route>

      <Route path="/grades" component={UserProtected}>
        <Route path="/" component={Grades} />
      </Route>

      <Route path="/dashboard" component={DashboardPage} />

      <Route path="/403" component={Forbidden} />
      <Route path="*404" component={WrongPage} />
    </Router>
  );
};

export default App;
