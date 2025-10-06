"use client"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { initDraw } from '../../draw'
import IconButton from './IconButton'
import { Circle, RectangleHorizontal, Square, Text, Triangle } from 'lucide-react'

const Canvas = ({roomId , socket ,realtime } : {roomId : string , socket? : WebSocket , realtime : boolean}) => {
    const [selectedTools , setSelectTools] = useState<string>("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        if (canvasRef.current) {
            initDraw(canvasRef.current , roomId , socket , selectedTools , realtime)
        }
    },[selectedTools])
  
  return <div style={{
    height : "100vh" ,
    overflow : "hidden"
  }}>
  <canvas  width={window.innerWidth} ref={canvasRef} height={window.innerHeight}  ></canvas>
  <Topbar setSelectTools={setSelectTools} selectedTools={selectedTools}/>
  </div> 
   
}

function Topbar({setSelectTools , selectedTools} : {
    setSelectTools : Dispatch<SetStateAction<string>> , 
    selectedTools : string
}) {
    return  <div style={{
    position : "fixed" ,
    top : 10 ,
    left : 10 ,
    backgroundColor : "white" 
  }}>
        <IconButton icon={<Circle />} name="circle" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<RectangleHorizontal />} name="rectangle" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<Triangle  />}  name="triangle" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<Text  />}  name="text" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
  </div>
    
}

export default Canvas