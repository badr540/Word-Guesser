import { useState, useContext, useEffect } from "react";
import LetterSlot from "./LetterSlot";
import Key from "./Key";
import GameOver from "./GameOver";
import Settings from "./Settings";
import SessionContext from "../contexts/SessionContext";
import Popup from "./popup"

import Confetti from 'react-confetti'

function Wordle() {
    const KeyStatus = {unused:0, used:1, inWord:2, inCorrectPosition: 3}

    const [keyStates, setKeyStates] = useState(Array.from({ length: 26 }, () => KeyStatus.unused))

    const maxGuesses = 6;
    const [guesses, setGuesses] = useState(0)
    const [guessLength, setGuessLength] = useState(0)
    const [session, sessionHandler, settings, changeSettings] = useContext(SessionContext)
    const [board, setBoard] = useState(Array.from({ length: maxGuesses }, (_, index) => 
        Array.from({ length: 4 }, (_, index) => 
            ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}) ) ))

    const [isGameOver, setGameOver] = useState(false)
    const [isGameWon, setGameWon] = useState(false)

    function handleGameInput(key){
        if(key == 'DEL'){
            if(guessLength > 0){
                setBoard(board.map((row, idx) => 
                    (idx == guesses)? row.map((slot,idx) => (idx == (guessLength-1) ? {...slot, letter: ''} : slot )) : row ))
                setGuessLength((val) => val-1)
                
            }
        }
        else if(key == 'Enter'){
            if(guessLength == session.word.length){
                //check if its correct here
                let word = board[guesses].reduce((s, slot, idx) => (s += slot.letter),(""))
                sessionHandler.makeGuess(word)
                
            }
        }
        else if(guessLength < session.word.length){
            setBoard(board.map((row, idx) => 
                (idx == guesses)? row.map((slot,idx) => (idx == guessLength ? {...slot, letter: key} : slot )) : row ))
            setGuessLength((val) => val+1)

        }
    }

    useEffect(() => {
        if(guesses == maxGuesses){
            setGameOver(true)
        }

        const handleKeyDown = (event) => {

            
            if(event.key == "Delete" || event.key == "Backspace"){
              handleGameInput("DEL")
            }
            else if(event.key == "Enter"){
              handleGameInput("Enter")
            }
            else if(/^[a-zA-Z]$/.test(event.key)){
                handleGameInput(event.key.toUpperCase())
            }

            const tagName = event.target.tagName.toLowerCase();
            const isInput = tagName === "input" || tagName === "textarea" || event.target.isContentEditable;
          
            if (!isInput) {
              event.preventDefault(); // Prevent browser going back
            }
        
        };
        
        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
          window.removeEventListener("keydown", handleKeyDown); // cleanup
        };
    }, [guessLength, guesses, session, board]);


    useEffect(() => {    
        setGameOver(session.status != "IN_PROGRESS")
        setGameWon(session.status == "WON")
        
        if(session.status != "IN_PROGRESS") return;

        let tempKeyStates = [...keyStates]
        for(let i = 0; i < board[guesses].length; i++){
            let letter = board[guesses][i].letter
            let idx = letter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
            let status = (session.word[i] == "*")? KeyStatus.used :
                         (session.word[i] == "!")? KeyStatus.inWord : KeyStatus.inCorrectPosition
            tempKeyStates[idx] = status

        }
        setKeyStates(tempKeyStates)

        setBoard(board.map((row, idx) => 
            (idx == guesses)? row.map((slot,idx) =>  
                ({...slot, inWord: session.word[idx] == '!', inCorrectPosition: /^[a-zA-Z]$/.test(session.word[idx]),  guessed:true})) : row ))
        setGuesses((val) => val+1)
        setGuessLength(0)

        

        if(session.attempts == maxGuesses){

            setBoard(Array.from({ length: maxGuesses }, (_, index) => 
                Array.from({ length: session.word.length }, (_, index) => 
                    ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}) ) ))
            setKeyStates(Array.from({ length: 26 }, () => KeyStatus.unused))
            setGuesses(0)
            setGuessLength(0)
        }

    }, [session])

    useEffect(() =>{
        let stats = JSON.parse(localStorage.getItem("Statistics"))
        if(isGameWon){
            
            localStorage.setItem("Statistics", JSON.stringify(
                {...stats, 
                    wins: stats.wins+1, 
                    currentStreak: stats.currentStreak+1,
                    bestStreak: (stats.bestStreak < stats.currentStreak+1) ? stats.currentStreak+1 : stats.bestStreak
                }
            ));
        }
        else if(isGameOver){
            localStorage.setItem("Statistics", JSON.stringify(
                {...stats, 
                    currentStreak: 0
                }
            ));
        }
    }, [isGameOver])

    let popup = <></>

    if(isGameOver){
        const settingsComponent = <Settings settings={settings} changeSettings={changeSettings}/>

        if(isGameWon){
            popup = 
            <Popup show={isGameOver} onClose={()=>{}} headerContent={"You Won! 🏆"} includeCloseBtn={false}>
                <GameOver SettingsComponent={settingsComponent} session={session} sessionHandler={sessionHandler}></GameOver>
            </Popup>

        }else{
            const gameOverMessage = (Date.now() > session.expiresAt) ? "Game over: time limit reached." : 
            (session.attempts == 0)? "Game over: no guesses remaining." : "Game over: player gave up."

            popup = 
            <Popup show={isGameOver} onClose={()=>{}} headerContent={gameOverMessage} includeCloseBtn={false}>
                <GameOver SettingsComponent={settingsComponent} session={session} sessionHandler={sessionHandler} >
                </GameOver>
            </Popup>
        }
        
    }




    //maybe clean this up
    const boardElements = board.map( (row, rowIdx) => (
        <div key={rowIdx} className=" flex space-x-2 space-y-2">{
            row.map((slot, sIdx ) => (
            <LetterSlot key={sIdx} index={sIdx} slotInfo={slot}>
                {slot.letter}
            </LetterSlot>))
        }</div>
    ));

    const keys = Array.from({ length: 26 }, (_, i) => <Key key={i} keyStatus={keyStates[i]} callback={() => handleGameInput(String.fromCharCode(65 + i))} keyCode = {String.fromCharCode(65 + i)}/>);
    keys.push(<Key key={keys.length} keyStatus={0} callback={ () => handleGameInput("DEL")} keyCode="DEL"/>)
    keys.push(<Key key={keys.length} keyStatus={0} callback={() => handleGameInput("Enter")} keyCode="Enter"/>)
    return (
        <div className="flex flex-col justify-center items-center">
            {popup}
            {isGameWon && <Confetti></Confetti>}
            <div className="p-4">{boardElements}</div>
            <div className="grid-auto space-x-2 space-y-2 max-w-1/2">{keys}</div>
        </div>
    )
}

export default Wordle
