"use client"
import React, { useEffect, useRef, useState } from 'react'
import { WS_URL } from '../../config'
import Canvas from './Canvas'

const MainCanvas = ({roomId} : any) => {
    const [socket , setSocket] = useState<WebSocket | null>(null) ;

    useEffect(()=>{
        const ws = new WebSocket(WS_URL)
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type : "join_room" ,
                roomId : roomId
            }))
        }
    })

    
    if (!socket) {
        return <div>
            Connecting to the server
        </div>
    } else {
        <Canvas roomId={roomId} socket={socket} />
    }
    
}

export default MainCanvas