function HeaderButton(props) {
  return (
      <button onClick={props.onClick} className="  bg-gray-200 whitespace-nowrap  text-gray-900 m-2">
          <div>{props.children}</div>
      </button>
  )
}

export default HeaderButton
