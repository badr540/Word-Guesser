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
      setSeconds(prev => prev - 1);
      
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if(seconds<0){
      onTimeout()
    }
  }, [seconds])

  useEffect(() => {
    setSeconds(Math.max((time / 1000).toFixed(0), 0))
  }, [time])

  return(
    <div className="flex text-center items-center uppercase justify-center bg-gray-200 whitespace-nowrap text-gray-900
    px-2 py-2 text-xs  rounded-sm  
    sm:px-4 sm:py-2 sm:text-base sm:rounded-sm
    md:px-6 md:py-3 md:rounded-md m-2">
      <div className='w-[5ch]'>{formatTime(seconds)}</div>
   </div>
  ) 

}

export default Timer;
