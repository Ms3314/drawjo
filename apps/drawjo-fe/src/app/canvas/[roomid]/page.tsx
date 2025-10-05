// import { useEffect, useRef } from "react"
// import { initDraw } from "../../../../draw";
import Canvas from "@/components/MainCanvas";

export default async function  CanvasPage ({params} : { 
    params: {
        roomid : string
    }    
    }
) {
    const roomId = (await params).roomid ;
    console.log(roomId , "we got the room id")
    
    return <Canvas roomId = {roomId} />
    
}