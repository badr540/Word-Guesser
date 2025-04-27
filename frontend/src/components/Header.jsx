import { useState, useContext, useEffect } from "react";
import WordContext from "../contexts/WordContext";
import HeaderButton from "./HeaderButton"
import Popup from "./popup"

function Header() {

  const [word, getNewWord, settings, changeSettings] = useContext(WordContext)
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  //give up popup
  let newGameBtn = <button className="!bg-[#6AC66A] !text-white" onClick={()=> {getNewWord(); setShowGiveUp(false)}}>New Game</button>
  let children = <><span className="gray-700 font-extralight">the answer was:</span> <div className="bg-gray-300 border-gray-400 border-2 rounded-xl p-3 pl-6 pr-6  w-fit mx-auto">{word}</div><br></br></>
  let giveupPopup = <Popup show={showGiveUp} onClose={()=>{}} headerContent={"You Lost!"}>{children}  {newGameBtn}</Popup>
  //settings popup
  let sizeSetting = 
  <div className="flex-col m-1">
    <span>number of letters</span>
    <div className="flex w-fit">
      <button 
      className={(settings.wordLength == -1) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {changeSettings({...settings, wordLength: -1})}}
      >any</button>

      {Array.from( {length: 7}, (_,index) => 
      <button 
      className={(settings.wordLength == index+3) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {changeSettings({...settings, wordLength: index + 3})}}
      >{index + 3}</button>)}
    </div>

  </div>

  let difficultySetting = 
  <div className="flex-col m-1">
    <span>difficulty</span>
    <div className="flex w-fit">
      <button 
      className={(settings.difficulty == -1) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {changeSettings({...settings, difficulty: -1})}}
      >any</button>

      {Array.from( {length: 4}, (_,index) => 
      <button 
      className={(settings.difficulty == index) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {changeSettings({...settings, difficulty: index})}}
      >{index}</button>)}
    </div>

  </div>

  let settingsPopup = <Popup show={showSettings} onClose={()=>{setShowSettings(false)}} headerContent={"Settings"}>{sizeSetting} {difficultySetting}</Popup>


  //stat popup
  const stats = JSON.parse(localStorage.getItem("Statistics"))
  let statsElements = 

  <div className="grid grid-cols-3 gap-4 m-1">
    <div className="flex flex-col bg-gray-300  rounded-2xl  p-4">
      <span className="font-bold text-gray-800 text-5xl">{stats.gamesPlayed}</span>
      <span className="font-extralight text-gray-400">Games Played</span>
    </div>
    <div className="flex flex-col bg-gray-300 rounded-2xl  p-4">
      <span className="font-bold text-gray-800 text-5xl">{stats.wins}</span>
      <span className="font-extralight text-gray-400">Number Of Wins</span>
    </div>
    <div className="flex flex-col bg-gray-300 rounded-2xl  p-4">
      <span className="font-bold text-gray-800 text-5xl">{ Math.round((stats.wins/stats.gamesPlayed||0) * 100)}</span>
      <span className="font-extralight text-gray-400">% Of Wins</span>
    </div>
    <div className="flex flex-col bg-gray-300 rounded-2xl  p-4">
      <span className="font-bold text-gray-800 text-5xl">{stats.currentStreak}</span>
      <span className="font-extralight text-gray-400">Current Streak</span>
    </div>

    <div className="flex flex-col bg-gray-300 rounded-2xl  p-4">
      <span className="font-bold text-gray-800 text-5xl">{stats.bestStreak}</span>
      <span className="font-extralight text-gray-400">Best Streak</span>
    </div>
  </div>

  let restStats = <div>
    <br className="border-2 border-black"></br>
    <button className="!bg-red-300"
      onClick={()=>{
        localStorage.setItem("Statistics", JSON.stringify({ gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0 }));
      }}
    >Reset Stats</button>
  </div>

  let statsPopup = <Popup show={showStats} onClose={()=>{setShowStats(false)}} headerContent={"Statistics"}>{statsElements} {restStats}</Popup>

  



  useEffect(()=>{
    console.log("word updated") 
  }, [word])

  return (
    <>
      <header className="flex justify-center p-2"  >
        {giveupPopup}
        {settingsPopup}
        {statsPopup}
        <div className="flex justify-evenly max-w-10/12 min-w-10/12">
          <HeaderButton onClick={() => setShowGiveUp((val) => !val)}>give up</HeaderButton>
          <div className="space-x-1">
            <HeaderButton onClick={()=> setShowStats(true)}>stats</HeaderButton>
            <HeaderButton onClick={()=> setShowSettings(true)}>settings</HeaderButton>
          </div>
        </div>

      </header>
    </>
  )
}

export default Header
