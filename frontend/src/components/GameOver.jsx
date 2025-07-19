
function GameOver({SettingsComponent, word, onNewGame = ()=>{}}) {
    return <>
    <div className="m-5">
    <h3 className="gray-700 font-extralight">the answer was:</h3> 
    <div className="bg-gray-300 border-gray-400  border-2 rounded-xl p-3 pl-6 pr-6 w-fit mx-auto">{word}</div>
    </div>
    
    {SettingsComponent} 
    

    <button className="bg-green-400 text-white" onClick={onNewGame}>New Game</button></>
}
  
export default GameOver