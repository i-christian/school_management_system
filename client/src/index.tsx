import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import Home from "./routes/home.tsx";
import About from "./routes/about.tsx";

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  ),
  document.getElementById("root")!
);
