import { useState } from 'react'
import Header from './components/Header.jsx'
import { WordProvider } from './contexts/WordContext.jsx'
import Wordle from './components/Wordle.jsx'

function App() {
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
