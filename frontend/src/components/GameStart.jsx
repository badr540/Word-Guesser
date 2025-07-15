
function GameStart({SettingsComponent, onNewGame = ()=>{}, onLoadGame = () =>{}}) {
    return <>
    <span>Start a new game</span> 
    <br></br>
    <span>Settings:</span> 
    {SettingsComponent} 
    <button className="bg-green-500 text-white" onClick={onNewGame}>New Game</button></>
}
  
export default GameStart