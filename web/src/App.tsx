import { Route, Switch } from "wouter";
import { Shell } from "./components/layout/Shell";
import { Home } from "./pages/Home";
import { Protocols } from "./pages/Protocols";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <Shell>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/protocols" component={Protocols} />
          {/* Future Routes: /terminal */}
          <Route>
            <div className="flex items-center justify-center min-h-[50vh] text-center">
              <h1 className="text-4xl font-display text-gray-500">404 // VOID_ERROR</h1>
            </div>
          </Route>
        </Switch>
      </AnimatePresence>
    </Shell>
  );
}

export default App;
