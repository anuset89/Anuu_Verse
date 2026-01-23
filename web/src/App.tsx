import React from 'react';
import { NexusShell } from './components/layout/NexusShell';
import { ThinkingStream } from './components/oracle/ThinkingStream';
import { CardRegion } from './components/surface/CardRegion';
import { ActionPanel } from './components/context/ActionPanel';

// High-Density Rituals Interface (v2.0)
// No routing, pure spatial UI.
function App() {
  return (
    <NexusShell
      leftPanel={<ThinkingStream />}
      centerPanel={<CardRegion />}
      rightPanel={<ActionPanel />}
    />
  );
}

export default App;
