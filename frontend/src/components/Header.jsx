import { useState, useContext, useEffect } from "react";
import WordContext from "../contexts/WordContext";
import HeaderButton from "./HeaderButton"
import Popup from "./popup"

function Header() {

  const [word, getNewWord, settings, setSettings] = useContext(WordContext)
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
      onClick={ () => {setSettings(settings => ({...settings, wordLength: -1}) )}}
      >any</button>

      {Array.from( {length: 7}, (_,index) => 
      <button 
      className={(settings.wordLength == index+3) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {setSettings(settings => ({...settings, wordLength: index + 3}) )}}
      >{index + 3}</button>)}
    </div>

  </div>

  let difficultySetting = 
  <div className="flex-col m-1">
    <span>difficulty</span>
    <div className="flex w-fit">
      <button 
      className={(settings.difficulty == -1) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {setSettings(settings => ({...settings, difficulty: -1}) )}}
      >any</button>

      {Array.from( {length: 4}, (_,index) => 
      <button 
      className={(settings.difficulty == index) && "!bg-[#6AC66A] !text-white"} 
      onClick={ () => {setSettings(settings => ({...settings, difficulty: index}) )}}
      >{index}</button>)}
    </div>

  </div>

  let settingsPopup = <Popup show={showSettings} onClose={()=>{setShowSettings(false)}} headerContent={"Settings"}>{sizeSetting} {difficultySetting}</Popup>


  //stat popup
  
  useEffect(()=>{
    console.log("word updated") 
  }, [word])

  return (
    <>
      <header className="flex justify-center p-2"  >
        {giveupPopup}
        {settingsPopup}
        <div className="flex justify-evenly max-w-10/12 min-w-10/12">
          <HeaderButton onClick={() => setShowGiveUp((val) => !val)}>give up</HeaderButton>
          <div className="space-x-1">
            <HeaderButton>stats</HeaderButton>
            <HeaderButton onClick={()=> setShowSettings(true)}>settings</HeaderButton>
          </div>
        </div>

      </header>
    </>
  )
}

export default Header
