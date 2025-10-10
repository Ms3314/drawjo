import { Dispatch, RefObject, SetStateAction } from "react";
import { HTTP_BACKEND } from "../config";
import axios from "axios";
import { storeAndGetDataInLocalStorage } from "@/components/Canvas";

export type Shape = {
    type : "rect" ,
    x : number ,
    y : number , 
    width : number ,
    height : number 
} | {
    type : "circle" , 
    centerX : number ,
    centerY : number ,
    radius : number 
} | {
    type : "arrow" | "line",
    fromX : number ,
    fromY : number ,
    toX : number ,
    toY : number 
}
// thankyou some random guy on stack overflow for this code
function drawArrow(ctx:CanvasRenderingContext2D, fromX:number, fromY:number, toX:number, toY:number, arrowWidth = 10, arrowLength = 15) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Calculate the angle of the line
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - arrowLength * Math.cos(angle - Math.PI / 6),
        toY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - arrowLength * Math.cos(angle + Math.PI / 6),
        toY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
}
function drawLine(ctx:CanvasRenderingContext2D, fromX:number, fromY:number, toX:number, toY:number, arrowWidth = 10, arrowLength = 15) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}

export async function initDraw(canvas : HTMLCanvasElement , roomId:string , socket? : WebSocket , selectedTools  : string = "rectangle" , realtime : boolean = false) {
            const ctx = canvas.getContext("2d");
            // ak methood hona jisse the context persists without even using the db for local stuff 
            let existingShapes:Shape[] = await getExistingShapes(roomId , realtime) 
            if (!ctx) return ;
            // get the message and add it into our temporary state 
            if (realtime && socket) {
                socket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    console.log(message)
                    if (message.type == "chat") {
                        // expecting that the message will contain an object with the type shape[]}
                        // console.log("this is the messages", typeof message.chats , message)
                        const parsedShape:Shape = JSON.parse(message.message);
                        existingShapes.push(parsedShape)
                        storeAndGetDataInLocalStorage("set" , existingShapes)
                        clearCanvas(existingShapes , canvas , ctx);
                    }
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
                const radius = width / 2
                const centerX = startX + radius 
                const centerY = startY + radius
                // look the thing here is x is the starting corodinate 
                // y is the other starting y cordinate 
                // now we put height and width kyuki usse pure shape ka pata chal jata 
                // thus when the thing is final we then push it into the thing
                console.log("what are u man" , selectedTools == "" ? "null" : selectedTools , "this is the selected tool")
                if (selectedTools === "rectangle") {
                    console.log("are we still rendering the rectangle")
                    let shape:Shape = {
                        type : "rect" ,
                        width ,
                        height ,
                        x : startX ,
                        y : startY
                    }
                    console.log(existingShapes , typeof existingShapes)
                    existingShapes.push(shape)
                    storeAndGetDataInLocalStorage("set" , existingShapes)

                    if (realtime && socket) {
                        socket.send(JSON.stringify({
                            type : "chat" ,
                            message : JSON.stringify(shape) ,
                            roomId : roomId
                        }))
                    }
                }
                if (selectedTools === "circle") {
                    let shape:Shape = {
                        type : "circle" ,
                        centerX : Math.abs(centerX) ,
                        centerY : Math.abs(centerY),
                        radius : Math.abs(radius)
                    }
                    console.log(existingShapes , typeof existingShapes)
                    existingShapes.push(shape)
                    storeAndGetDataInLocalStorage("set" , existingShapes)
                    if (realtime && socket) {
                        socket.send(JSON.stringify({
                            type : "chat" ,
                            message : JSON.stringify(shape) ,
                            roomId : roomId
                        }))
                    }
                    // console.log("this is also being sel while mouseup")
                    // ctx.beginPath();
                    // ctx.arc(startX + radius , startY + radius  , radius , 0 , 2 * Math.PI , false);
                    // // ctx.arc(e.clientX - radius , e.clientY - radius , radius , 0 , 2 * Math.PI , false);
                    // ctx.stroke()
                }
                if (selectedTools === "arrow") {
                    let shape:Shape = {
                        type : "arrow" ,
                        fromX : startX  ,
                        fromY : startY ,
                        toX : e.clientX ,
                        toY : e.clientY
                    }
                    console.log(existingShapes , typeof existingShapes)
                    existingShapes.push(shape)
                    storeAndGetDataInLocalStorage("set" , existingShapes)
                }
                if (selectedTools === "line") {
                    let shape:Shape = {
                        type : "line" ,
                        fromX : startX  ,
                        fromY : startY ,
                        toX : e.clientX ,
                        toY : e.clientY
                    }
                    console.log(existingShapes , typeof existingShapes)
                    existingShapes.push(shape)
                    storeAndGetDataInLocalStorage("set" , existingShapes)
                }
                if (selectedTools === "arrow") {
                    let shape:Shape = {
                        type : "arrow" ,
                        fromX : startX  ,
                        fromY : startY ,
                        toX : e.clientX ,
                        toY : e.clientY
                    }
                    console.log(existingShapes , typeof existingShapes)
                    existingShapes.push(shape)
                    storeAndGetDataInLocalStorage("set" , existingShapes)
                }
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
                        const height = e.clientY - startY ;
                        const radius = width / 2
                        const centerX = startX + radius 
                        const centerY = startY + radius

                        clearCanvas(existingShapes , canvas , ctx )
                        // here we are creating a rect here 
                        // first adding the stroke color
                        ctx.strokeStyle= "rgba(255 , 255 , 255)"
                        // then here we are adding putting the real thing 
                        if (selectedTools === "rectangle") {
                            ctx.strokeRect(startX , startY , width , height)
                        } 
                        if (selectedTools === "circle") {
                            ctx.beginPath();
                            ctx.arc(Math.abs(centerX) ,Math.abs(centerY), Math.abs(radius) , 0 , 2 * Math.PI , false);
                            // ctx.arc(startX , startY , radius , 0 , 2 * Math.PI , false);
                            ctx.stroke()
                        } 
                        if (selectedTools === "arrow") {
                            drawArrow(ctx , startX , startY, e.clientX , e.clientY)
                        }
                        if (selectedTools === "line") {
                            drawLine(ctx , startX , startY, e.clientX , e.clientY)
                        } 
                        if (selectedTools === "pencil") {
                            ctx.beginPath();
                            ctx.arc(8, 8 , 90, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
            })
}

function clearCanvas( existingShapes : Shape[] , canvas : HTMLCanvasElement ,  ctx : CanvasRenderingContext2D) {
    ctx.clearRect(0,0, canvas.width , canvas.height) ;
    ctx.fillStyle = "rgba(0 , 0 , 0)"
    ctx.fillRect(0,0,canvas.width , canvas.height);
    // this function draws the existing shapes
    if (existingShapes?.length == 0 || !existingShapes || typeof existingShapes === "string") return ;
    console.log("why is this showing some random error" , typeof existingShapes)
    console.log("why is this showing some random error" , typeof existingShapes)

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255 , 255 , 255)"
            ctx.strokeRect(shape.x , shape.y , shape.width , shape.height)           
        } 
        if (shape.type === "circle" && shape.radius >= 0) {
            ctx.beginPath();
            ctx.arc(shape.centerX , shape.centerY  , shape.radius , 0 , 2 * Math.PI , false);
            // ctx.arc(e.clientX - radius , e.clientY - radius , radius , 0 , 2 * Math.PI , false);
            ctx.stroke()
        }
        if (shape.type === "arrow") {
            drawArrow(ctx , shape.fromX , shape.fromY , shape.toX , shape.toY)
        }
        if (shape.type === "line") {
            drawLine(ctx , shape.fromX , shape.fromY , shape.toX , shape.toY)
        }
    })
}


async function getExistingShapes(roomId : string , realtime : boolean) {
    if (realtime === false ) {
        const store = storeAndGetDataInLocalStorage("get", [])
        if (store != null) {
            return JSON.parse(store)
        } else {
            return []
        }
    } 
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

