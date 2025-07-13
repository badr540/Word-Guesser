
function Stats() {
    const stats = JSON.parse(localStorage.getItem("Statistics"))
    let statsElements = (
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
    </div>)

    let restStats = <div>
      <br className="border-2 border-black"></br>
      <button className="!bg-red-300"
        onClick={()=>{
          localStorage.setItem("Statistics", JSON.stringify({ gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0 }));
        }}
      >Reset Stats</button>
    </div>
      
      
    return <>{statsElements} {restStats}</>
  }
  
  export default Stats