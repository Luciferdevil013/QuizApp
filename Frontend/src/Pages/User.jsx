import React from 'react'
import Sidebar from './Sidebar'
import QuizSection from './QuizSection.jsx'
import ScroreBoard from './ScroreBoard'

function User() {
    return (
        <>
            <div className='w-full h-full flex relative'>

                <Sidebar />
                {/* <QuizSection /> */}

                {/* <div className='fixed' style={{ bottom:'6rem',right:'20rem'}}>
                    <button className='border-2 rounded-md border-white py-2 px-4 bg-black text-white text-xl'>Next</button>
                </div> */}
                <ScroreBoard />
            </div>
        </>
    )
}

export default User