"use client"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { initDraw, Shape } from '../../draw'
import IconButton from './IconButton'
import { ArrowBigDown, ArrowDown, ArrowDown01, ArrowRight, BrushCleaningIcon, Circle, LineChart, Minus, Pencil, RectangleHorizontal, Square, Text, Triangle } from 'lucide-react'

export function storeAndGetDataInLocalStorage(job : string , data? : Shape[] ) : string | null  {
  if (job === "set" && data) {
    const serialized = JSON.stringify(data);
    localStorage.setItem("shapes", serialized);
    return null
  } else if (job === "get") {
    const shapes = localStorage.getItem("shapes") ; 
    if (shapes) {
      return shapes
    }
    return null;
  }
  return null;
}

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
    const handleClearScreen = () => {
      localStorage.setItem("shapes","")
      setSelectTools("")
    }
    return  <div style={{
    position : "fixed" ,
    top : 10 ,
    left : 10 ,
    backgroundColor : "white" 
  }}>
        <IconButton icon={<Circle />} name="circle" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<RectangleHorizontal />} name="rectangle" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<Triangle  />}  name="triangle" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<Pencil  />}  name="pencil" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<Text  />}  name="text" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<ArrowDown/>}  name="arrow" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        <IconButton icon={<Minus/>}  name="line" selectedTools={selectedTools} setSelectTools={setSelectTools}></IconButton>
        {/* <IconButton icon={}  name="line" handleClearScreen={selectedTools} setSelectTools={setSelectTools}></IconButton> */}
        <button onClick={handleClearScreen}><BrushCleaningIcon/></button>
  </div>
    
}

export default Canvas