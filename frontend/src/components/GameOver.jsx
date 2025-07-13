
function GameOver({SettingsComponent, session, sessionHandler, onNewGame = ()=>{}}) {
    let children = <><span className="gray-700 font-extralight">the answer was:</span> <div className="bg-gray-300 border-gray-400 border-2 rounded-xl p-3 pl-6 pr-6  w-fit mx-auto">{session != null && session.word}</div><br></br></>
    let newGameBtn = <button className="!bg-[#6AC66A] !text-white" onClick={()=> {sessionHandler.createSession(); onNewGame()}}>New Game</button>

    return <>{children} {SettingsComponent} {newGameBtn}</>
}
  
export default GameOver