
function Settings({settings, changeSettings}) {
    const selectedStyle = "bg-green-400 text-white m-1"
    const unselectedStyle = "m-1 bg-gray-300 text-black"
    const sizeSetting = 
    <div className="flex-co">
       <section>
      <h3 className="gray-700 font-extralight">
        Number Of Letters
      </h3>
      <div className="flex w-fit">
        <button 
        key={"n"+-1}
        className={(settings.wordLength == -1) ? selectedStyle : unselectedStyle} 
        onClick={ () => {changeSettings({...settings, wordLength: -1})}}
        >any</button>
        {Array.from( {length: 7}, (_,index) => 
        <button 
        key={"n"+index}
        className={(settings.wordLength == index+3) ? selectedStyle : unselectedStyle} 
        onClick={ () => {changeSettings({...settings, wordLength: index + 3})}}
        >{index + 3}</button>)}
      </div>
      </section>
    </div>

    const difficultySetting = 
    <div className="flex-col m-1">
      <h3 className="gray-700 font-extralight">
        Difficulty
      </h3>
      <div className="flex w-fit">
        <button 

        className={(settings.difficulty == -1) ? selectedStyle : unselectedStyle} 
        onClick={ () => {changeSettings({...settings, difficulty: -1})}}
        >any</button>

        {Array.from( {length: 4}, (_,index) => 
        <button 
        key={"d"+index}
        className={(settings.difficulty == index) ? selectedStyle : unselectedStyle} 
        onClick={ () => {changeSettings({...settings, difficulty: index})}}
        >{index}</button>)}
      </div>

    </div>
  
    return <div className="flex-col m-3">{sizeSetting} {difficultySetting}</div>
}
  
export default Settings