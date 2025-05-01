import { useState, useContext, useEffect } from "react";
import LetterSlot from "./LetterSlot";
import Key from "./Key";
import WordContext from "../contexts/WordContext";
import SessionContext from "../contexts/SessionContext";
import Popup from "./popup"

import Confetti from 'react-confetti'

function Wordle() {
    
    const maxGuesses = 6;
    const [guesses, setGuesses] = useState(0)
    const [guessLength, setGuessLength] = useState(0)
    const [session, sessionHandler] = useContext(SessionContext)
    const [board, setBoard] = useState(Array.from({ length: maxGuesses }, (_, index) => 
        Array.from({ length: 4 }, (_, index) => 
            ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}) ) ))

    const [isGameOver, setGameOver] = useState(false)
    const [isGameWon, setGameWon] = useState(false)

    useEffect(() => {
        sessionHandler.createSession()
    }, []);
    
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
            console.log(guessLength)
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
          
        };
        
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
          window.removeEventListener("keydown", handleKeyDown); // cleanup
        };
    }, [guessLength, guesses, session, board]);


    useEffect(() => {
        console.log(session.word)

        setBoard(board.map((row, idx) => 
            (idx == guesses)? row.map((slot,idx) =>  
                ({...slot, inWord: session.word[idx] == '!', inCorrectPosition: /^[a-zA-Z]$/.test(session.word[idx]),  guessed:true})) : row ))
        setGuesses((val) => val+1)
        setGuessLength(0)


        setGameOver(session.status != "IN_PROGRESS")
        setGameWon(session.status == "WON")

        if(session.attempts == 5){
            setBoard(Array.from({ length: maxGuesses }, (_, index) => 
                Array.from({ length: session.word.length }, (_, index) => 
                    ({letter:"", inWord:false, inCorrectPosition:false, guessed:false}) ) ))
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
    }, [isGameWon])

    let popup = <></>

    if(isGameOver){
        let newGameBtn = <button className="!bg-[#6AC66A] !text-white" onClick={()=> sessionHandler.createSession()}>New Game</button>

        if(isGameWon){
            popup = <Popup show={isGameOver} onClose={()=>{}} headerContent={"You Won! 🏆"} children={newGameBtn}/>
        }else{
            let children = <><span className="gray-700 font-extralight">the answer was:</span> <div className="bg-gray-300 border-gray-400 border-2 rounded-xl p-3 pl-6 pr-6  w-fit mx-auto">{session.word}</div><br></br></>
            popup = <Popup show={isGameOver} onClose={()=>{}} headerContent={"You Lost!"}>{children}  {newGameBtn}</Popup>
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

    const keys = Array.from({ length: 26 }, (_, i) => <Key key={i} callback={() => handleGameInput(String.fromCharCode(65 + i))} keyCode = {String.fromCharCode(65 + i)}/>);
    keys.push(<Key key={keys.length} callback={ () => handleGameInput("DEL")} keyCode="DEL"/>)
    keys.push(<Key key={keys.length}  callback={() => handleGameInput("Enter")} keyCode="Enter"/>)
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
