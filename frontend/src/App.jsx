import { useState } from 'react'
import Header from './components/Header.jsx'
import { SessionProvider } from './contexts/SessionContext.jsx';
import { KeyListenerProvider } from './contexts/KeyListenerContext.jsx';
import GameContainer from './components/GameContainer.jsx'
import Footer from './components/Footer.jsx';
function App() {
  if (!localStorage.getItem("Statistics")) {
    localStorage.setItem("Statistics", JSON.stringify({ gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0 }));
  }

  return (
    <>
      <SessionProvider>
      <KeyListenerProvider>
        <div className="flex flex-col min-h-screen">
          <Header/>
          <GameContainer/>
          <Footer/>
        </div>
      </KeyListenerProvider>
      </SessionProvider>
    </>
  )
}

export default App
