import { NexusShell } from './components/layout/NexusShell';
import { ThinkingStream } from './components/oracle/ThinkingStream';
import { FeedRegion } from './components/surface/FeedRegion';
import { NodeRegion } from './components/surface/NodeRegion';

// High-Density Rituals Interface (v2.1)
// Grok-inspired 3-column architecture
function App() {
  return (
    <NexusShell
      sidebar={<NodeRegion />}
      main={<ThinkingStream />}
      feed={<FeedRegion />}
    />
  );
}

export default App;
