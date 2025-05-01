import { useState } from 'react'
import Header from './components/Header.jsx'
import { SessionProvider } from './contexts/SessionContext.jsx';
import Wordle from './components/Wordle.jsx'

function App() {
  if (!localStorage.getItem("Statistics")) {
    localStorage.setItem("Statistics", JSON.stringify({ gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0 }));
  }

  return (
    <>
      <SessionProvider>
        <div className="min-h-screen">
          <Header/>
          <main>
            <Wordle />
          </main>
        </div>
      </SessionProvider>
    </>
  )
}

export default App
