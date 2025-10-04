// import { useEffect, useRef } from "react"
// import { initDraw } from "../../../../draw";
import Canvas from "@/components/MainCanvas";

export default async function  CanvasPage ({params} : { 
    params: {
        roomId : string
    }
}) {
    const roomId1 = (await params).roomId ;
    console.log(roomId1)

    return <Canvas roomId = {roomId1} />
}