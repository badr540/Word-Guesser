function Key(props) {
    let color = (props.keyStatus == 0)? "bg-gray-200" :(props.keyStatus == 1)? "bg-gray-400":(props.keyStatus == 2)? "bg-orange-300" : "bg-green-500"  
    return (
          <button onClick={props.callback} className={`${color} m-0.5 sm:m-1`}>
              {props.keyCode}
          </button>
    )
  }
  
  export default Key
  