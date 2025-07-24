import { useState, useRef } from "react"

function CreateGame(){
    const [message, setMessage] = useState(<span></span>)
    const inputRef = useRef();

    const handleSubmit = () => {
        fetch("/sessions?word=" + inputRef.current.value, {method:'POST'})
        .then(response => response.json())
        .then(data =>{ 
            if ("sessionId" in data){
                setMessage(
                    <a 
                    class="text-blue-600 hover:text-blue-800 underline hover:underline cursor-pointer m-2" 
                    href={`${window.location.origin}?sessionId=${data.sessionId}`}
                    >
                        New Session
                    </a>)
            }
            else{
                setMessage( <h3 className="gray-700 font-extralight bg-red-200 rounded-xl p-1 m-2">Word does not exist!</h3>)
            }
        })
        .catch(error => console.error("Error:", error));
    };

    return (<>
        <h3 className="gray-700 font-extralight m-2">create a game using a word of your choice</h3>
        <input type="text" placeholder="Your word" className="border-1 rounded-xs m-2 p-1"ref={inputRef}/>
        {message}
        <button onClick={handleSubmit} className="bg-gray-300">submit</button> 
    </>)
}

export default CreateGame;