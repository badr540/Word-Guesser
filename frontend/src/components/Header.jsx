import { useState, useContext, useEffect } from "react";
import HeaderButton from "./HeaderButton"
import Popup from "./popup"
import Stats from "./Stats";
import Timer from "./Timer";
import Settings from "./Settings";
import SessionContext from "../contexts/SessionContext";
import CreateGame from "./CreateGame";
import { Cog6ToothIcon, ChartBarIcon, PlusCircleIcon  } from '@heroicons/react/24/outline';

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
      <Popup show={showSettings} onClose={()=>setShowSettings(false)} headerContent={"Game settings"}>{settingsComponent}</Popup>
      <Popup show={showStats} onClose={()=>setShowStats(false)} headerContent={"Game statistics"} ><Stats/></Popup>
      <Popup show={showCreateGame} onClose={()=>setShowCreateGame(false) } headerContent={"Create a game"}><CreateGame/></Popup>

      <header className=" w-full flex flex-wrap justify-evenly border-b-1 m-0" > 
        <div className="flex flex-wrap justify-evenly">
        <HeaderButton onClick={() => {sessionHandler.giveup()}}>give up</HeaderButton>
        <Timer time={timeLeft} onTimeout={onTimeout}/>
        </div>

        <div className="flex flex-wrap justify-evenly">
        <HeaderButton onClick={()=> setShowCreateGame(true)}><PlusCircleIcon className="h-5 w-5" /></HeaderButton>
        <HeaderButton onClick={()=> setShowStats(true)}><ChartBarIcon className="h-5 w-5" /></HeaderButton>
        <HeaderButton onClick={()=> setShowSettings(true)}><Cog6ToothIcon className="h-5 w-5" /></HeaderButton>
        </div>
      </header>

    </>
  )
}

export default Header
