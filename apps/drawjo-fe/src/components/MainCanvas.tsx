"use client"
import React, { useEffect, useRef, useState } from 'react'
import { WS_URL } from '../../config'
import Canvas from './Canvas'
import { useRouter } from 'next/navigation'

const MainCanvas = ({roomId} : any) => {
    const [socket , setSocket] = useState<WebSocket | null>(null) ;
    const [token , setToken] = useState<string>();
    // const token = localStorage.getItem("token")
    const router = useRouter()
    
    useEffect(() => {
        // This code only runs on the client-side
        if (typeof window !== 'undefined') {
          const storedData = localStorage.getItem('token');
          if (storedData) {
            setToken(storedData);
          } else {
            if (!token) {
                router.push('/invalid')
            }
          }
        }
      }, []);

    
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`)
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type : "join_room" ,
                roomId : roomId
            }))
        }
    },[])

    
    if (!socket) {
        return <div>
            Connecting to the server
        </div>
    } else {
        return <Canvas realtime={true} roomId={roomId} socket={socket} />
    }
    
}

export default MainCanvas