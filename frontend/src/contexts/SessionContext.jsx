import { createContext, useContext, useEffect, useState } from "react";
const SessionContext = createContext(); // Create the context

function validateShape(obj, shape) {
  if (typeof obj !== 'object' || obj === null) return false;

  for (const key in shape) {

        if (!(key in obj)) return false;
        
        const expectedType = typeof shape[key];
        const actualType = typeof obj[key];
        
        if(expectedType !== actualType){
            return false;
        } 
    }

    return true;
}

export const SessionProvider = ({ children }) => {

    const sessionSchema = {
        sessionId: "",
        userId: -1,
        status: "STARTING",
        guesses: [],
        results: [],
        word: "",
        rarity: 0,
        attempts: 6,
        expiresAt: 0
    }

    const settingsSchema = { 
        wordLength: 4, 
        difficulty: -1 
    }

    
    const minWordLength = 3;
    const maxWordlength = 7;
    const [session, setSession] = useState(sessionSchema)
    const [settings, setSettings] = useState(settingsSchema);
    const [message, setMessage] = useState("")

    const newUrl = `${window.location.origin}/?id=${session.sessionId}`;
    if(window.location.href != newUrl) window.history.pushState({}, '', newUrl);

    
    useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem("Settings"))
        if (!storedSettings || validateShape(storedSettings, settingsSchema)) {
            localStorage.setItem("Settings", JSON.stringify(settingsSchema));
        }
        else{
            setSettings(storedSettings)
        }
        

        if(window.__SESSION_DATA__ != null && validateShape(window.__SESSION_DATA__, sessionSchema)){
            setSession(window.__SESSION_DATA__)
            return;
        }

        const storedSession  = JSON.parse(localStorage.getItem("Session"))
        if(storedSession && validateShape(storedSession, sessionSchema) && storedSession.expiresAt > Date.now()){
            setSession(storedSession)
        }

    }, [])


    const changeSettings = (newSetting) =>{
        if(validateShape(newSetting, settingsSchema)){   
            localStorage.setItem("Settings", JSON.stringify(newSetting))
            setSettings(newSetting)
        }
    }

    const handleRecivedSession = (recivedSession, isGuess = false) =>{
        if(! validateShape(recivedSession, sessionSchema)) return; 
        if(session.guesses.length == recivedSession.guesses.length 
            && isGuess 
            && recivedSession.status == "IN_PROGRESS"){
            setMessage("Word not Found")
            return;
        }
        
        localStorage.setItem("Session", JSON.stringify(recivedSession))
        setSession(recivedSession) 
        setMessage("")
    }

    const sessionHandler = {
        
        createSession: () => {
            const stats = JSON.parse(localStorage.getItem("Statistics"))
            localStorage.setItem("Statistics", JSON.stringify({...stats, gamesPlayed: stats.gamesPlayed+1 }));
            
            let length = settings.wordLength;
            
            if(length == -1){
                length = Math.round(Math.random() * (maxWordlength - minWordLength)) + minWordLength
            }
                        
            let difficulty = settings.difficulty;
            
            if(difficulty == -1){
                difficulty = Math.round(Math.random()*3)
            }
            
            fetch("/sessions?wordLength=" + length + "&rarity=" + difficulty, {method:'POST'})
            .then(response => response.json())
            .then(data => handleRecivedSession(data))
            .catch(error => console.error("Error:", error));
        },

        checkStatus: () =>{
            if(session === null || session.sessionId === "") return;
            fetch("/sessions/status", {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(session)
            })
            .then(response => response.json())
            .then(data => handleRecivedSession(data))
            .catch(error => console.error("Error:", error));
        },
        
        makeGuess: (word) =>{
            if(session == null) return;
            if(session.word.length != word.length){
                setMessage("Word is too small")
                return ;
            }
            fetch("/sessions/guess", {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({...session, word: word})
            })
            .then(response => response.json())
            .then(data => handleRecivedSession(data, true))
            .catch(error => console.error("Error:", error));
            
        },

        giveup: () =>{
            if(session == null) return;
            
            fetch("/sessions/giveup", {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify(session)
            })
            .then(response => response.json())
            .then(data => handleRecivedSession(data))
            .catch(error => console.error("Error:", error));

        }
        
    }

    //expiration check when we first load (necessary for relaoding the session after closing the tab for a while)
    if(session.status != "LOST" && Date.now() > session.expiresAt){
        sessionHandler.checkStatus()
    }

    console.log(session)
    return (
      <SessionContext.Provider value={[session, sessionHandler, settings, changeSettings, message, setMessage]}>
        {children}
      </SessionContext.Provider>
    );
};

export default SessionContext;