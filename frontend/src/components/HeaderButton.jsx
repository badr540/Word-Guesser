function HeaderButton(props) {
  return (
        <button onClick={props.onClick} className="bg-gray-200 text-gray-950 rounded-sm p-2 hover:cursor-pointer hover:bg-gray-400">
            {props.children}
        </button>
  )
}

export default HeaderButton
