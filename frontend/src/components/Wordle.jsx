import { useState, useContext, useEffect } from "react";
import LetterSlot from "./LetterSlot";
import Keyboard from "./Keyboard";
import GameOver from "./GameOver";
import Settings from "./Settings";
import GameStart from "./GameStart";
import SessionContext from "../contexts/SessionContext";
import KeyListenerContext from "../contexts/KeyListenerContext";
import Popup from "./popup"
import MessagePopup from "./MessagePopup";
import Confetti from 'react-confetti'

function Wordle() {
    const [session, sessionHandler, settings, changeSettings, message, setMessage] = useContext(SessionContext)
    const [KeyListenerHandler, keydown, setKeyDown] = useContext(KeyListenerContext)

    const KeyStatus = {unused:0, used:1, inWord:2, inCorrectPosition: 3}
    const keyMap = {};
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i); // 'A' is 65
      keyMap[letter] = KeyStatus.unused;
    }
    keyMap["Enter"] = KeyStatus.unused
    keyMap["DEL"] = KeyStatus.unused

    const [keyStates, setKeyStates] = useState(keyMap)

    const maxGuesses = 6;
    const [guesses, setGuesses] = useState(0)
    const [guessLength, setGuessLength] = useState(0)
    const [board, setBoard] = useState(Array.from({ length: maxGuesses }, (_, index) => 
        Array.from({ length: 4 }, (_, index) => 
            ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}) 
    )))
    const [showMessage, setShowMessage] = useState(false)
    const [isGameOver, setGameOver] = useState(false)
    const [isGameWon, setGameWon] = useState(false)

    function handleGameInput(key){
        switch(key){
            case 'DELETE':
            case 'BACKSPACE':
                if(guessLength > 0){
                    board[guesses][guessLength-1] = {...board[guesses][guessLength-1], letter: ''}
                    setBoard(board)
                    setGuessLength((val) => val-1)          
                }
                break;
            case 'ENTER':
                let word = board[guesses].reduce((s, slot, idx) => (s += slot.letter),(""))
                sessionHandler.makeGuess(word)
                break;
            default:
                if(guessLength < session.word.length){
                    board[guesses][guessLength] = {...board[guesses][guessLength], letter: key}
                    setBoard(board)
                    setGuessLength((val) => val+1)
                }
        }
        setKeyDown('')
    }

    useEffect(() => {

        if(keydown == "Delete" || keydown == "Backspace" || keydown == "Enter" || /^[a-zA-Z]$/.test(keydown)){
          handleGameInput(keydown.toUpperCase())
        }

    }, [guessLength, guesses, session, board, keydown]);


    useEffect(() => {    
        setGameOver(session.status != "IN_PROGRESS" && session.status != "STARTING")
        setGameWon(session.status == "WON")
        
        if(session.status != "IN_PROGRESS") return;

        for(let i = 0; i < session.guesses.length; i++){
            for(let j = 0; j < session.word.length; j++){
                let letter = session.guesses[i][j].toUpperCase()
                if(keyStates[letter] == KeyStatus.inCorrectPosition) continue;
                let status = (session.results[i][j] == '*') ? KeyStatus.used :
                (session.results[i][j] == '!') ? KeyStatus.inWord : KeyStatus.inCorrectPosition
                keyStates[letter] = status
            }
        }

        setKeyStates(keyStates)


        setBoard(Array.from({ length: maxGuesses }, (_, rowIdx) => {
            if(rowIdx < session.guesses.length){
                return Array.from({ length: settings.wordLength}, (_, colIdx) => (
                {
                    letter: session.guesses[rowIdx][colIdx]?.toUpperCase(),
                    inWord: session.results[rowIdx][colIdx] == '!', 
                    inCorrectPosition: /^[a-zA-Z]$/.test(session.results[rowIdx][colIdx]),  
                    guessed:true
                }))
            }
            return Array.from({ length: settings.wordLength}, (_, colIdx) => ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}))
        }))

        setGuesses(session.guesses.length)
        setGuessLength(0)


        if(session.attempts == maxGuesses){

            setBoard(Array.from({ length: maxGuesses }, (_, index) => 
                Array.from({ length: session.word.length }, (_, index) => 
                    ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}) ) ))
            
            for(let letter of Object.keys(keyStates)){
                keyStates[letter] = KeyStatus.unused;
            }

            setKeyStates(keyStates)
            setGuesses(0)
            setGuessLength(0)
        }
        KeyListenerHandler.enableListener();
    }, [session])

    useEffect(() =>{
        let stats = JSON.parse(localStorage.getItem("Statistics"))
        if(!isGameOver){ return }

        const bestStreak = (isGameWon)? stats.currentStreak+1 : 0
        localStorage.setItem("Statistics", JSON.stringify(
            {...stats, 
                wins: (isGameWon)? stats.wins+1: stats.wins, 
                currentStreak: bestStreak,
                bestStreak: (stats.bestStreak < bestStreak) ? bestStreak : stats.bestStreak
            }
        ));

    }, [isGameOver])

    useEffect(()=>{
        setShowMessage(message!="")
    }, [message])

    const settingsComponent = <Settings settings={settings} changeSettings={changeSettings}/>

    const boardElements = board.map( (row, rowIdx) => (
        <div key={rowIdx} className=" flex space-x-2 space-y-2">{
            row.map((slot, sIdx ) => (
            <LetterSlot key={sIdx} index={sIdx} slotInfo={slot}>
                {slot.letter}
            </LetterSlot>))
        }</div>
    ));


    const gameOverMessage = (Date.now() > session.expiresAt) ? "Game over: time limit reached." : 
        (session.attempts == 0)? "Game over: no guesses remaining." : "Game over: player gave up."
    return (
        <div className="flex flex-col justify-center items-center">
            {showMessage && <MessagePopup message={message} onClose={() => {setShowMessage(false); setMessage("")}} ></MessagePopup>}
            <Popup show={session.status == "WON"} onClose={()=>{}} headerContent={"You Won! 🏆"} includeCloseBtn={false}>
                <GameOver SettingsComponent={settingsComponent} word={session.word} 
                onNewGame={() => {sessionHandler.createSession();}}></GameOver>
                <Confetti></Confetti>
            </Popup>

            <Popup show={session.status == "LOST"} onClose={()=>{}} headerContent={gameOverMessage} includeCloseBtn={false}>
                <GameOver SettingsComponent={settingsComponent}word={session.word} 
                onNewGame={() => {sessionHandler.createSession();}}>
                </GameOver>
            </Popup>
            
            <Popup show={session.status == "STARTING"} onClose={()=>{}} headerContent={"Start"} includeCloseBtn={false}>
                <GameStart SettingsComponent={settingsComponent} 
                onNewGame={() => {sessionHandler.createSession();}}>
                </GameStart>
            </Popup>

            <div className="p-4">{boardElements}</div>
            <Keyboard keyStates={keyStates}/>
        </div>
    )
}

export default Wordle
