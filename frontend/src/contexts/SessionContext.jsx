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

    const DEFAULT_SESSION = {
        sessionId: "",
        status: "STARTING",
        guesses: [],
        results: [],
        word: "",
        rarity: 0,
        attempts: 6,
        expiresAt: 0
    }

    const DEFAULT_SETTINGS = { 
        wordLength: 4, 
        difficulty: 0 
    }

    
    const minWordLength = 3;
    const maxWordlength = 7;
    const [session, setSession] = useState(DEFAULT_SESSION)
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [message, setMessage] = useState("")
    

    useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem("Settings"))
        if (!validateShape(storedSettings, DEFAULT_SETTINGS)) {
            localStorage.setItem("Settings", JSON.stringify(DEFAULT_SETTINGS));
        }
        else{
            setSettings(storedSettings)
        }

        console.log("embeded session:", window.__SESSION_DATA__)
        if(window.__SESSION_DATA__ != null && validateShape(window.__SESSION_DATA__, DEFAULT_SESSION)){
            setSession(window.__SESSION_DATA__)
            return;
        }

        const storedSession  = JSON.parse(localStorage.getItem("Session"))
        if(storedSession && validateShape(storedSession, DEFAULT_SESSION) && storedSession.expiresAt > Date.now()){
            setSession(storedSession)
        }

    }, [])


    const changeSettings = (newSetting) =>{
        if(validateShape(newSetting, DEFAULT_SETTINGS)){   
            localStorage.setItem("Settings", JSON.stringify(newSetting))
            setSettings(newSetting)
        }
    }

    const handleReceivedSession  = (receivedSession) =>{
        if(! validateShape(receivedSession, DEFAULT_SESSION)) return; 
        console.log(receivedSession)
        if(session.guesses.length == receivedSession.guesses.length 
            && receivedSession.sessionId == session.sessionId
            && receivedSession.status == "IN_PROGRESS"
            && session.expiresAt > Date.now()){
            setMessage("Word not Found")
            return;
        }
        localStorage.setItem("Session", JSON.stringify(receivedSession))
        setSession(receivedSession) 
        setMessage("")
    }

    const handleResponse = async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      if(response.headers.get('Location')) {
        window.history.pushState({}, '',response.headers.get('Location'));
      }
      
      return response.json();
    };


    const sessionHandler = {
        
        createSession: () => {
            const stats = JSON.parse(localStorage.getItem("Statistics"))
            localStorage.setItem("Statistics", JSON.stringify({...stats, gamesPlayed: stats.gamesPlayed+1 }));
            
            let length = (settings.wordLength > 0) 
            ? settings.wordLength 
            : Math.round(Math.random() * (maxWordlength - minWordLength)) + minWordLength;
       
            let difficulty = (settings.difficulty > 0) 
            ?  settings.difficulty 
            : Math.round(Math.random()*3);
            

            fetch(`/sessions?wordLength=${length}&rarity=${difficulty}`, {method:'POST'})
            .then(handleResponse)
            .then(session => handleReceivedSession (session))
            .catch(error => console.error("Error:", error));
        },

        checkStatus: () =>{
            if(session === null || session.sessionId === "") return;
            fetch(`/sessions/${session.sessionId}`, {method:'GET'})
            .then(handleResponse)
            .then(session => handleReceivedSession (session))
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
            .then(handleResponse)
            .then(session => handleReceivedSession (session, true))
            .catch(error => console.error("Error:", error));
            
        },
        giveup: () =>{
            if(session == null) return;
            
            fetch(`/sessions/${session.sessionId}/giveup`, {method:'POST'})
            .then(handleResponse)
            .then(session => handleReceivedSession (session))
            .catch(error =>{
                console.error("Error:", error)
                setSession(DEFAULT_SESSION)
            });

        }
        
    }

    console.log(session)
    return (
      <SessionContext.Provider value={[session, sessionHandler, settings, changeSettings, message, setMessage]}>
        {children}
      </SessionContext.Provider>
    );
};

export default SessionContext;