import { RefObject } from "react";
import { HTTP_BACKEND } from "../config";
import axios from "axios";

type Shape = {
    type : "rect" ,
    x : number ,
    y : number , 
    width : number ,
    height : number 
} | {
    type : "cicle" , 
    centerX : number ,
    centerY : number ,
    radius : number 
}

export async function initDraw(canvas : HTMLCanvasElement , roomId:string , socket: WebSocket) {
            const ctx = canvas.getContext("2d");

            let existingShapes:Shape[] = await getExistingShapes(roomId) 
            if (!ctx) return ;
            // get the message and add it into our temporary state 
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message)
                if (message.type == "chat") {
                    // expecting that the message will contain an object with the type shape[]}
                    // console.log("this is the messages", typeof message.chats , message)
                    const parsedShape:Shape = JSON.parse(message.message);
                    existingShapes.push(parsedShape)
                    clearCanvas(existingShapes , canvas , ctx);
                }
            }


            // ctx.fillStyle = "rgba(0 , 0 , 0)"
            // ctx.fillRect(0 , 0 , canvas.width , canvas.height)
            clearCanvas(existingShapes , canvas , ctx )

            let clicked = false ;
            let startX = 0 ;
            let startY = 0 ;
            canvas.addEventListener("mouseup", (e)=> {
                // mouseup ka mtlb mouse leave kardiye toh 
                clicked = false 
                const width = e.clientX - startX ;
                const height = e.clientY - startY ;
                // look the thing here is x is the starting corodinate 
                // y is the other starting y cordinate 
                // now we put height and width kyuki usse pure shape ka pata chal jata 
                // thus when the thing is final we then push it into the thing
                const shape:Shape = {
                    type : "rect" ,
                    width ,
                    height ,
                    x : startX ,
                    y : startY
                }
                existingShapes.push(shape)
                
                socket.send(JSON.stringify({
                    type : "chat" ,
                    message : JSON.stringify(shape) ,
                    roomId : roomId
                }))
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
                        clearCanvas(existingShapes , canvas , ctx )
                        // here we are creating a rect here 
                        // first adding the stroke color
                        ctx.strokeStyle= "rgba(255 , 255 , 255)"
                        // then here we are adding putting the real thing 
                        ctx.strokeRect(startX , startY , width , heigt)
                    }
            })
}

function clearCanvas( existingShapes : Shape[] , canvas : HTMLCanvasElement ,  ctx : CanvasRenderingContext2D) {
    ctx.clearRect(0,0, canvas.width , canvas.height) ;
    ctx.fillStyle = "rgba(0 , 0 , 0)"
    ctx.fillRect(0,0,canvas.width , canvas.height);
    // this function draws the existing shapes
        existingShapes.map((shape) => {
            if (shape.type === "rect") {
                ctx.strokeStyle = "rgba(255 , 255 , 255)"
                ctx.strokeRect(shape.x , shape.y , shape.width , shape.height)           
            } 
        })
}


async function getExistingShapes(roomId : string) {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${HTTP_BACKEND}/chat/${roomId}` , {
        headers : {
            Authorization : token
        }
    });
    console.log(res.data)
    const messages = res.data.chats;
    if (messages && messages[0]?.message) {
        const shape = messages.map((x:{message : string})=>{
            return JSON.parse(x.message)
        })
    return shape
    }
    return [] ;
}

