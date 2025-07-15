function HeaderButton(props) {
  return (
      <button onClick={props.onClick} className="h-12 bg-gray-200  text-gray-900 rounded-sm hover:cursor-pointer hover:bg-gray-400 ">
          <div>{props.children}</div>
      </button>
  )
}

export default HeaderButton
