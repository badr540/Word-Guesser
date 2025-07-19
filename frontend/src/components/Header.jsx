import { useState, useContext, useEffect } from "react";
import HeaderButton from "./HeaderButton"
import Popup from "./popup"
import Stats from "./Stats";
import Timer from "./Timer";
import Settings from "./Settings";
import SessionContext from "../contexts/SessionContext";
import CreateGame from "./CreateGame";

function Header() {

  const [session, sessionHandler, settings, changeSettings] = useContext(SessionContext)
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0)
  const settingsComponent = <Settings settings={settings} changeSettings={changeSettings}/>

  useEffect(()=>{
    setTimeLeft((session.expiresAt - Date.now()))
  },[session])

  //          

  const onTimeout = (session.status == "IN_PROGRESS") ? () => sessionHandler.checkStatus() : () =>{}
  return (
    <>
      <Popup show={showSettings} onClose={()=>setShowSettings(false)} headerContent={"Settings"}>{settingsComponent}</Popup>
      <Popup show={showStats} onClose={()=>setShowStats(false)} headerContent={"Game Statistics"} ><Stats/></Popup>
      <Popup show={showCreateGame} onClose={()=>setShowCreateGame(false) } headerContent={"Create game"}><CreateGame/></Popup>

      <header className="w-full flex flex-wrap justify-evenly border-b-1 m-0"  > 
        <div className="flex flex-wrap justify-evenly">
        <HeaderButton onClick={() => {sessionHandler.giveup()}}>give up</HeaderButton>
        <Timer time={timeLeft} onTimeout={onTimeout}/>
        </div>

        <div className="flex flex-wrap justify-evenly">
        <HeaderButton onClick={()=> setShowCreateGame(true)}>Create game</HeaderButton>
        <HeaderButton onClick={()=> setShowStats(true)}>stats</HeaderButton>
        <HeaderButton onClick={()=> setShowSettings(true)}>settings</HeaderButton>
        </div>
      </header>

    </>
  )
}

export default Header
