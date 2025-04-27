import { useState } from 'react'
import Header from './components/Header.jsx'
import { WordProvider } from './contexts/WordContext.jsx'
import Wordle from './components/Wordle.jsx'

function App() {
  if (!localStorage.getItem("Statistics")) {
    localStorage.setItem("Statistics", JSON.stringify({ gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0 }));
  }

  return (
    <>
      <WordProvider>
        <div className="min-h-screen">
          <Header/>
          <main>
            <Wordle />
          </main>
        </div>
      </WordProvider>
    </>
  )
}

export default App
