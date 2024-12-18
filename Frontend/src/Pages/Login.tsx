import React from 'react'

function Login() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='w-1/4 h-3/4 bg-slate-200 rounded-md px-4 flex flex-col justify-center gap-4'>

        <div className='w-full h-auto flex flex-col gap-2'>
          <p className='text-lg font-medium'>Email</p>
          <input className='w-full text-lg font-medium p-1 rounded border-none outline-none' type="email" placeholder='Enter Your Email' />
        </div>

        <div className='w-full h-auto flex flex-col gap-2'>
          <p className='text-lg font-medium'>Password</p>
          <input className='w-full text-lg font-medium p-1 rounded border-none outline-none' type="text" placeholder='Enter Your Password' />
        </div>

        <div className='w-full h-auto flex items-center justify-center mt-4'>
          <button className='w-auto h-auto px-20 py-2 bg-slate-100 rounded-full'>Submit</button>
        </div>

        <div className='w-full h-auto flex mt-4'>
          <a href="#" className='text-black-300 text-lg'>Register Now! Sign Page </a>
        </div>
      </div>
    </div>
  )
}

export default Login