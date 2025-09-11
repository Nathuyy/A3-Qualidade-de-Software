import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import BattleshipLobby from './Pages/Lobby/index.tsx'
import GridGame from './Pages/GameInitial/index.tsx'
import WaitingPage from './Pages/WaitingPage/index.tsx'
import Game from './Pages/Game/index.tsx'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!;

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<BattleshipLobby />} />
          <Route path="/game" element={<GridGame />} />
          <Route path="/gameBattle" element={<Game />} />
          <Route path="/waiting" element={<WaitingPage />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  // eslint-disable-next-line no-console
  console.error('Root element not found');
}
