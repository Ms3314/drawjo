"use client"
import { useEffect, useRef } from "react"

export default function Canvas () {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return ;
            let clicked = false ;
            let startX = 0 ;
            let startY = 0 ;
            canvas.addEventListener("mouseup", (e)=> {
                // mouseup ka mtlb mouse leave kardiye toh 
                clicked = false 
                console.log(e.clientX)
                console.log(e.clientY)
            })
            canvas.addEventListener("mousedown" , (e) => {
                // mousedown mtlb mouse click kar diye 
                clicked = true 
                startX = e.clientX
                startY = e.clientY
            })
            
            canvas.addEventListener("mousemove", (e)=> {
                    if (clicked) {
                        const width = e.clientX - startX ;
                        const heigt = e.clientY - startY ;
                        ctx.clearRect(0,0,canvas.width , canvas.height);
                        ctx.strokeRect(startX , startY , width , heigt)
                    }
            })
        }

    },[])
    return <div>
        <p>Hello everyone</p>
        <canvas width={500} ref={canvasRef} height={500} className="bg-white border-4 border-red-500"></canvas>
    </div>
}