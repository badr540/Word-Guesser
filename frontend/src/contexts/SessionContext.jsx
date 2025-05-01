import { createContext, useContext, useState } from "react";
const SessionContext = createContext(); // Create the context

export const SessionProvider = ({ children }) => {

    if (!localStorage.getItem("Settings")) {
      localStorage.setItem("Settings", JSON.stringify({ wordLength: 5, difficulty: -1 }));
    }

    const stored_Setting = JSON.parse(localStorage.getItem("Settings")) || {wordLength: 5, difficulty: -1}
    const minWordLength = 3;
    const maxWordlength = 7;
    const [session, setSession] = useState(
        {
        sessionId: "",
        userId: -1,
        status: "IN_PROGRESS",
        word: "",
        rarity: 0,
        attempts: 6,
        expiresAt: ""
    })
    const [settings, setSettings] = useState(stored_Setting);
    
    const changeSettings = (newSetting) =>{
        localStorage.setItem("Settings", JSON.stringify(newSetting))
        setSettings(newSetting)
    }

    const sessionHandler = {

        createSession: () => {
            
            const stats = JSON.parse(localStorage.getItem("Statistics"))
            localStorage.setItem("Statistics", JSON.stringify({...stats, gamesPlayed: stats.gamesPlayed+1 }));
            
            let length = settings.wordLength;
            
            if(length == -1){
                length = Math.round(Math.random() * (maxWordlength - minWordLength)) + minWordLength
            }
            
            console.log(length)
            
            let difficulty = settings.difficulty;
            
            if(difficulty == -1){
                difficulty = Math.round(Math.random()*3)
            }
            
            fetch("/sessions?wordLength=" + length + "&rarity=" + difficulty, {method:'POST'})
            .then(response => response.json())
            .then(data =>{ setSession(data), console.log("retrieved data: " + data)})
            .catch(error => console.error("Error:", error));
        },
        
        makeGuess: (word) =>{
            if(session == null) return;
            console.log(word)
            fetch("/sessions/guess", {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({...session, word: word})})
            .then(response => response.json())
            .then(data =>{ setSession(data), console.log(data)})
            .catch(error => console.error("Error:", error));
            
        },

        giveup: () =>{
            if(session == null) return;
            
            fetch("/sessions/giveup", {method:'POST', body: JSON.stringify(session)})
            .then(response => response.json())
            .then(data =>{ setSession(data)})
            .catch(error => console.error("Error:", error));

        }
        
    }

    console.log(session)


    return (
      <SessionContext.Provider value={[session, sessionHandler, settings, changeSettings]}>
        {children}
      </SessionContext.Provider>
    );
};

export default SessionContext;