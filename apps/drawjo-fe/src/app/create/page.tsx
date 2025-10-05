"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { createNewRoom } from '../methoods/http-extra'

const page = () => {
    const [room , setRoom] = useState<string>()
    const router = useRouter()
    const handleSubmit = () => {
        console.log("Checking for the room ")
        if (room) {
            createNewRoom(room)
        }
    }
  return (
    <>
    <div>
        <div>Create new room</div>
        <input onChange={(e)=> setRoom(e.target.value)} type="text" placeholder='give the name'/>
        <button onClick={handleSubmit}>Submit</button>
    </div>
    <div>
        <div>Join A room</div>
        <input onChange={(e)=> setRoom(e.target.value)} type="text" placeholder='give the id'/>
        <button onClick={()=> router.push(`/canvas/${room}`)
        }>Submit</button>
    </div>
        
    </>
  )
}



export default page