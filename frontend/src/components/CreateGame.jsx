import { useState, useRef } from "react"

function CreateGame(){
    const [message, setMessage] = useState(<span></span>)
    const inputRef = useRef();

    const handleSubmit = () => {
        fetch("/sessions?word=" + inputRef.current.value, {method:'POST'})
        .then(response => response.json())
        .then(data =>{ 
            if ("sessionId" in data){
                setMessage(<a href={`${window.location.origin}?sessionId=${data.sessionId}`}>go to new session</a>)
            }
            else{
                setMessage(<span>Word does not exist!</span>)
            }
        })
        .catch(error => console.error("Error:", error));
    };

    return (<>
        <span>create a game using a word of your choice</span>
        <input type="text" placeholder="Your word" ref={inputRef}/>
        {message}
        <button onClick={handleSubmit}>submit</button> 
    </>)
}

export default CreateGame;