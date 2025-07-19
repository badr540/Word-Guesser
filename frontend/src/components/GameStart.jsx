
function GameStart({SettingsComponent, onNewGame = ()=>{}, onLoadGame = () =>{}}) {
    return <>
   <h1 className="gray-700 m-5">Start a new game</h1> 

    {SettingsComponent} 
    <button className="bg-green-500 text-white" onClick={onNewGame}>New Game</button></>
}
  
export default GameStart