function LetterSlot(props) {
    let animationClass = ''
    if(props.slotInfo.guessed){
      let duration = 250 * (props.index+1) 
      let bgColor = "gray"
      animationClass = `origin-center animate-[shrink-expand-gray_500ms_ease-in-out_forwards]`
      if(props.slotInfo.inCorrectPosition){
        animationClass = `origin-center animate-[shrink-expand-green_500ms_ease-in-out_forwards]`
      }
      else if(props.slotInfo.inWord){
        bgColor = "orange"
        animationClass = `origin-center animate-[shrink-expand-orange_500ms_ease-in-out_forwards]`
      }

    }

    return (
          <div className={`  ${animationClass} bg-[#e8ebf2] text-gray-950 rounded-sm border-2 border-gray-400 h-15 min-h-10 aspect-square flex items-center justify-center`}>
              {props.children}
          </div>
    )
  }
  
export default LetterSlot
  