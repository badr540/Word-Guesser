
function Settings({settings, changeSettings}) {
    let sizeSetting = 
    <div className="flex-col m-1">
      <span>number of letters</span>
      <div className="flex w-fit">
        <button 
        key={-1}
        className={(settings.wordLength == -1) ? "bg-green-500 text-white" : undefined} 
        onClick={ () => {changeSettings({...settings, wordLength: -1})}}
        >any</button>
        {Array.from( {length: 7}, (_,index) => 
        <button 
        key={index}
        className={(settings.wordLength == index+3) && "bg-green-500 text-white"} 
        onClick={ () => {changeSettings({...settings, wordLength: index + 3})}}
        >{index + 3}</button>)}
      </div>

    </div>

    let difficultySetting = 
    <div className="flex-col m-1">
      <span>difficulty</span>
      <div className="flex w-fit">
        <button 

        className={(settings.difficulty == -1) && "bg-green-500 text-white"} 
        onClick={ () => {changeSettings({...settings, difficulty: -1})}}
        >any</button>

        {Array.from( {length: 4}, (_,index) => 
        <button 
        key={index}
        className={(settings.difficulty == index) && "bg-green-500 text-white"} 
        onClick={ () => {changeSettings({...settings, difficulty: index})}}
        >{index}</button>)}
      </div>

    </div>
  
    return <>{sizeSetting} {difficultySetting}</>
}
  
export default Settings