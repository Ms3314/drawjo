import { Dispatch, RefObject, SetStateAction } from "react";
import { HTTP_BACKEND } from "../config";
import axios from "axios";
import { storeAndGetDataInLocalStorage } from "@/components/Canvas";
import { clear } from "console";

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
} | {
    type : "point" ,
    pointX : number ,
    pointY : number
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
function drawPoint(ctx:CanvasRenderingContext2D, pointX:number , pointY:number) {
    // ctx.fillRect(pointX , pointY,10,10)
    ctx.moveTo(pointX , pointY)
    ctx.stroke()
}

export async function initDraw(stopSelectedTools : () => void , canvas : HTMLCanvasElement , roomId:string , socket? : WebSocket , selectedTools  : string = "rectangle" ,    realtime : boolean = false) {
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
            let complete = ""
            let coordiX = 0 ;
            let coordiY = 0 ;
            let intialClickPosX = 0
            let intialClickPosY = 0
            // function textualFunction(e: MouseEvent) {
            //     if (!ctx) return ;
            //     handleClickFunctionality(e , ctx)
            // }
            // function KeyDownForListeningForText(es : any) {
            //             const pattern:RegExp = new RegExp("^[a-zA-Z ]$")
            //             console.log(es.key , "this is the escape key")
            //             if (!ctx) return 
            //             if (es.key === "Escape") { 
            //                 console.log("this is escape key")
            //                 stopSelectedTools()
            //                 clearCanvas(existingShapes , canvas , ctx)
            //                 complete = ""
            //                 canvas.removeEventListener("click" , textualFunction)
            //                 canvas.removeEventListener("keydown" , KeyDownForListeningForText)
            //                 return ;
            //             }
            //             if (es.key === "Backspace") {
            //                 console.log("Backspace is being hit")
            //                 let sub = complete.slice(0 , complete.length-1)
            //                 complete = sub
            //                 clearCanvas(existingShapes , canvas , ctx)
            //                 ctx.fillStyle = "white";  // Set the fill color for text
            //                 ctx.strokeStyle = "rgba(255, 255, 255)";
            //                 ctx.font = "48px serif";
            //                 ctx.fillText(complete, coordiX , coordiY);
            //             }
            //             if (pattern.test(es.key) === false) {
            //                 return ;
            //             }
            //             complete+=es.key ;
            //             console.log("this is hte keydown now" , complete , "text")
            //             ctx.fillStyle = "white";  // Set the fill color for text
            //             ctx.strokeStyle = "rgba(255, 255, 255)";
            //             ctx.font = "48px serif";
            //             ctx.fillText(complete, coordiX , coordiY);
            // }
            // function handleClickFunctionality(e: MouseEvent , ctx:CanvasRenderingContext2D) {
            //     clearCanvas(existingShapes , canvas , ctx)
            //     stopSelectedTools()
            //      if (selectedTools == "text") {
            //         // ctx.fillStyle = "white";  // Set the fill color for text
            //         // ctx.strokeStyle = "rgba(255, 255, 255)";
            //         // ctx.font = "48px serif";
            //         // let complete = ""
            //         // ctx.fillText(complete, e.clientX, e.clientY);
            //         coordiX = e.clientX ;
            //         coordiY = e.clientY
            //         document.addEventListener("keydown" , KeyDownForListeningForText)
            //     }
            // }
            // canvas.addEventListener("click", textualFunction)

            let textToolActive = false;

            function textualFunction(e: MouseEvent) {
                if (!ctx || selectedTools !== "text") return;
                
                intialClickPosX = e.clientX;
                intialClickPosY = e.clientY;
                coordiX = e.clientX;
                coordiY = e.clientY;
                complete = "";
                textToolActive = true;

                clearCanvas(existingShapes, canvas, ctx);
            }

            function KeyDownForListeningForText(es: KeyboardEvent) {
                if (!textToolActive || !ctx) return;
                let sizepx = 20 
                const pattern = /^[a-zA-Z ]$/;

                if (es.key === "Escape") {
                    stopSelectedTools();
                    clearCanvas(existingShapes, canvas, ctx);
                    complete = "";
                    textToolActive = false;
                    return;
                }

                if (es.key === "Backspace") {
                    complete = complete.slice(0, -1);
                } else if (pattern.test(es.key)) {
                    complete += es.key;
                }
                
                if (es.key === "Enter") {
                    coordiX = intialClickPosX ;
                    coordiY = intialClickPosY + 10 + sizepx
                    complete = ""
                }

                clearCanvas(existingShapes, canvas, ctx);
                ctx.fillStyle = "white";
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.font = `${sizepx}px serif`;
                ctx.fillText(complete, coordiX, coordiY);
            }

// Attach once at initialization
            canvas.addEventListener("click", textualFunction);
            document.addEventListener("keydown", KeyDownForListeningForText);

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
                if (selectedTools === "point") {
                    let shape:Shape = {
                        type : "point" ,
                        pointX : e.clientX ,
                        pointY : e.clientY
                    }
                    console.log(existingShapes , typeof existingShapes)
                    existingShapes.push(shape)
                    storeAndGetDataInLocalStorage("set" , existingShapes)
                }
                //  if (selectedTools == "text") {
                //     let complete = ""
                //     document.addEventListener("keydown" , (es) => {
                //         complete+=es.key ;
                //         console.log("this is hte keydown now" , complete , "text")
                //         ctx.fillStyle = "white";  // Set the fill color for text
                //         ctx.strokeStyle = "rgba(255, 255, 255)";
                //         ctx.font = "48px serif";
                //         ctx.fillText("Hello world", e.clientX, e.clientY);
                //     })
                // }
            })
            canvas.addEventListener("mousedown" , (e) => {
                // mousedown mtlb mouse click kar diye 
                ctx.strokeStyle= "rgba(255 , 255 , 255)"
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
                        if (selectedTools === "point") {
                            console.log("this is the point")
                            drawPoint(ctx , e.clientX , e.clientY)
                        } 
                        if (selectedTools === "text") {
                            // text can only be trigerred when it is on mousedown 
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
    ctx.font = "48px serif";
            // console.log("are we coming here ")
            // ctx.fillStyle = "white";  // Set the fill color for text
            // ctx.strokeStyle = "rgba(255, 255, 255)";
            // ctx.fillText("Hello world", 100, 500);
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
        if (shape.type === "point") {
            drawPoint(ctx , shape.pointX , shape.pointY)
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

