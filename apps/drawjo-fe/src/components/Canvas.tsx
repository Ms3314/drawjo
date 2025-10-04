"use client"
import React, { useEffect, useRef } from 'react'
import { initDraw } from '../../draw'

const Canvas = ({roomId , socket} : {roomId : string , socket : WebSocket}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        if (canvasRef.current) {
            initDraw(canvasRef.current , roomId , socket)
        }
    },[])
  
  return <div>
        <canvas className=" border-3"  width={10800} ref={canvasRef} height={1000}  ></canvas>
    </div>
}

export default Canvas