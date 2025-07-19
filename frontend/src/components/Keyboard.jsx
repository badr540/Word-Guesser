import Key from "./Key"

function Keyboard({keyStates, callback}) {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ["Delete", 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter']
    ]
                    
    const keyboardElements = keys.map((row) => 
        <div className="flex justify-center w-full max-w-md mx-auto">
            {row.map(keycode => <Key key={keycode} keyStatus={keyStates[keycode.toUpperCase()]} callback={() => callback(keycode)} keyCode = {keycode}/>)}
        </div>
    )  
    return (keyboardElements)
  }
  
export default Keyboard
  