import Key from "./Key"

function Keyboard({keyStates}) {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ["DEL", 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter']
    ]
                    
    const keyboardElements = keys.map((row) => 
        <div className="flex justify-center">
            {row.map(keycode => <Key key={keycode} keyStatus={keyStates[keycode]} callback={() => handleGameInput(keycode)} keyCode = {keycode}/>)}
        </div>
    )  
    return (keyboardElements)
  }
  
export default Keyboard
  