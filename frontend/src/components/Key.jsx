function Key(props) {
    let color = (props.keyStatus == 0)? "bg-gray-200" :(props.keyStatus == 1)? "bg-gray-400":(props.keyStatus == 2)? "bg-orange-300" : "bg-green-400"  
    return (
          <button onClick={props.callback} className={` ${color} text-gray-950 rounded-sm p-5 hover:cursor-pointer hover:bg-gray-400`}>
              {props.keyCode}
          </button>
    )
  }
  
  export default Key
  