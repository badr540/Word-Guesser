function Key(props) {
    return (
          <button onClick={props.callback} className="bg-gray-200 text-gray-950 rounded-sm p-5 hover:cursor-pointer hover:bg-gray-400">
              {props.keyCode}
          </button>
    )
  }
  
  export default Key
  