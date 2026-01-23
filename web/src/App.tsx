import { Route, Switch } from "wouter";
import { Shell } from "./components/layout/Shell";
import { Home } from "./pages/Home";
import { Protocols } from "./pages/Protocols";
import { Wiki } from "./pages/Wiki";
import { AnimatePresence } from "framer-motion";

import { SystemProvider } from "./context/SystemContext";

function App() {
  return (
    <SystemProvider>
      <Shell>
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/protocols" component={Protocols} />
            <Route path="/wiki/:path*" component={Wiki} />
            <Route>
              <div className="flex items-center justify-center min-h-[50vh] text-center">
                <h1 className="text-4xl font-display text-gray-500">404 // VOID_ERROR</h1>
              </div>
            </Route>
          </Switch>
        </AnimatePresence>
      </Shell>
    </SystemProvider>
  );
}

export default App;
