import { useRouter } from 'next/router'
import React, { useState } from 'react'

const page = () => {
    const [room , setRoom] = useState<string>()
    const router = useRouter()
    const handleSubmit = () => {
        console.log("Checking for the room ")
        
    }
  return (
    <>
    <div>
        <div>Create new room</div>
        <input onChange={(e)=> setRoom(e.target.value)} type="text" />
        <button onClick={handleSubmit}>Submit</button>
    </div>
    <div>
        <div>Join A room</div>
        <input onChange={(e)=> setRoom(e.target.value)} type="text" />
        <button onClick={()=> router.push(`/canvas/${room}`)
        }>Submit</button>
    </div>
        
    </>
  )
}



export default page