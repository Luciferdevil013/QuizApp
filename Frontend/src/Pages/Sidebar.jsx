import React from 'react'

function Sidebar() {
  return (
    <>
      <div className='w-3/12 h-full bg-slate-200 flex flex-col gap-5'>
        <div className='logo w-full pt-16 flex items-center justify-center'>
          <img className='w-20 h-20' src="https://img.freepik.com/premium-vector/quiz-vector-logo-isolate-white-questionnaire-icon-poll-sign-flat-bubble-speech-symbols_189959-1100.jpg?semt=ais_hybrid" alt="logo" />
        </div>
        <div className='userinfo text-xl px-4 py-4 border-b-2 border-solid border-slate-800'>User Account </div>
        <div className='w-full h-fit bg-black flex'>
          <a className='w-full h-full py-4 px-4 text-white text-xl' href="#">Quiz</a>
        </div>
        <div className='w-full h-fit bg-black flex'>
          <a className='w-full h-full py-4 px-4 text-white text-xl' href="#">Score Board</a>
        </div>
        {/* <div className='w-full h-fit bg-black flex'>
          <a className='w-full h-full py-4 px-4 text-white text-xl' href="#">Settings</a>
        </div> */}
      </div>
    </>
  )
}

export default Sidebar