import React, { useState, useEffect } from 'react';

function formatTime(seconds) {
  if(seconds < 0 || (typeof seconds !== "number")) seconds = 0
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function Timer({time, onTimeout}) {
  const [seconds, setSeconds] = useState(Math.max((time / 1000).toFixed(0), 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev>0) ?  prev - 1 : prev);
      
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if(seconds<=0){
      onTimeout()
    }
  }, [seconds])

  useEffect(() => {
    setSeconds(Math.max((time / 1000).toFixed(0), 0))
  }, [time])

  return(
    <div className="h-12 flex text-center items-center uppercase justify-center center-text align-middle bg-gray-200 text-[#444b5a] px-[20px] py-[10px] rounded-[10px] m-[5px]">
      <div className='w-[5ch]'>{formatTime(seconds)}</div>
   </div>
  ) 

}

export default Timer;
