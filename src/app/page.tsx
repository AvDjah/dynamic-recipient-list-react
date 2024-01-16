'use client'

import InputBox from '@/components/InputBox'








export default function Home() {
    return (
        <div className="mx-auto rounded-xl md:w-2/3  p-4 m-4 " >
            <div className='mx-auto p-4 shadow-xl text-center text-3xl' >Pick User</div>
            <InputBox></InputBox>
        </div>
    )
}