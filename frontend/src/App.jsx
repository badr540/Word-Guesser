import { useState } from 'react'
import Header from './components/Header.jsx'
import { SessionProvider } from './contexts/SessionContext.jsx';
import { KeyListenerProvider } from './contexts/KeyListenerContext.jsx';
import Wordle from './components/Wordle.jsx'
import Footer from './components/Footer.jsx';
function App() {
  if (!localStorage.getItem("Statistics")) {
    localStorage.setItem("Statistics", JSON.stringify({ gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0 }));
  }

  return (
    <>
      <SessionProvider>
      <KeyListenerProvider>
        <div className="min-h-screen">
          <Header/>
          <Wordle/>
          <Footer/>
        </div>
      </KeyListenerProvider>
      </SessionProvider>
    </>
  )
}

export default App
