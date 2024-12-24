import React from 'react'

function ScroreBoard() {
    return (
        <>
            <div className='w-full flex flex-col gap-10'>
                <div className='py-28 w-full text-center'>
                    <h1 className='text-3xl'>Score Board Ranking </h1>
                </div>
                <table className='w-full h-fit flex flex-col'>
                    <tr className='w-full h-fit flex py-4'>
                        <th className='w-1/4 h-fit text-xl'>User ID</th>
                        <th className='w-1/4 h-fit text-xl'>Name</th>
                        <th className='w-1/4 h-fit text-xl'>Rank </th>
                        <th className='w-1/4 h-fit text-xl'>Score</th>
                    </tr>
                    <tr className='w-full h-fit flex'>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>1</td>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>Sujeet Yadav</td>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>1</td>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>1000</td>
                    </tr>
                    <tr className='w-full h-fit flex'>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>2</td>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>Tushar Teli</td>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>2</td>
                        <td className='w-1/4 h-fit text-center py-6 text-lg'>900</td>
                    </tr>
                </table>
            </div>

        </>
    )
}

export default ScroreBoard