
function GameOver({SettingsComponent, word, onNewGame = ()=>{}}) {
    return <>
    <span className="gray-700 font-extralight">the answer was:</span> 
    <div className="bg-gray-300 border-gray-400  border-2 rounded-xl p-3 pl-6 pr-6  w-fit mx-auto">{word}</div>
    <br></br>
    <span className="gray-700 font-extralight">Settings:</span> 
    {SettingsComponent} 
    <button className="bg-green-500 text-white" onClick={onNewGame}>New Game</button></>
}
  
export default GameOver