// High-Density Rituals Interface (v2.1)
// Grok-inspired 3-column architecture
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SystemProvider } from './context/SystemContext';
import { Home } from './pages/Home';
import { Wiki } from './pages/Wiki';
import { Protocols } from './pages/Protocols';

// High-Density Rituals Interface (v2.1)
// Grok-inspired 3-column architecture
import { AnuuDashboardV2 } from './pages/AnuuDashboardV2';

function App() {
  return (
    <Router basename="/Anuu_Verse">
      <SystemProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/protocols" element={<Protocols />} />
          <Route path="/v2" element={<AnuuDashboardV2 />} />
        </Routes>
      </SystemProvider>
    </Router>
  );
}

export default App;
