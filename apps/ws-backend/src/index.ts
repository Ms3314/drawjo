import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"  
import { JWT_SECRET } from '@repo/backend-common/config';
import {prismaClient} from '@repo/db/db' 

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws : WebSocket ,
  rooms : string[] ,
  userId : string
}

const UserState : User[] = []
// this function checks if the token is valid or not 
function checkUser (token : string) : null | string {
  const decoded = jwt.verify(token , JWT_SECRET);
  if (typeof decoded == "string") {
    return null;
  }

  if (!decoded || !decoded.userId ) {
    return null;
  }
  return decoded.userId ;  
}


wss.on('connection', function connection(ws : WebSocket , request) {
  try {
    ws.on('error', console.error);

    // first we need to extract the token before we even start 
    const url = request.url ;
    if (!url) {
      console.log(url , "this is the url")
      return ;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userIdFromTheToken = checkUser(token)
    if (!userIdFromTheToken) {
      ws.close();
      return ; 
    }

    
      UserState.push({
        ws : ws ,
        rooms : [] ,
        userId : userIdFromTheToken
      })
    

    ws.on('message', async function message(data) {
      try {
        const parsedData = JSON.parse(data as unknown as string)  // {type : "join_room" , roomId : "232"}
      
        if (parsedData.type === "join_room") {
          const user = UserState.find(x => x.ws === ws);
          // check if the room exists and credential support etc
          // everyone should have auth 
          user?.rooms.push(parsedData.roomId)
          console.log(UserState)
        }
        
        if (parsedData.type === "leave_room") {
            const user = UserState.find(x => x.ws === ws);
            if (!user || !user.rooms) return ; 
            user.rooms = user?.rooms.filter(x => x !== parsedData.roomId)
        }

        if (parsedData.type === "chat") {
          try{
            console.log("------------------------------------------------")
            console.log("------------------------------------------------")
            console.log("------------------------------------------------")
            console.log(UserState)
            console.log("------------------------------------------------")
            console.log("------------------------------------------------")
            console.log("------------------------------------------------")
          const roomId = parsedData.roomId ;
          const message = parsedData.message ; 
          console.log(roomId , message , parsedData)
          await prismaClient.chat.create({
            data : {
              roomId : Number(roomId) ,
              message ,
              userId : userIdFromTheToken ,
              adminId : userIdFromTheToken,
            }
          })
          UserState.forEach(item => {
            console.log("Are we even inside" , typeof item.rooms , item.rooms , item.userId)
            if (item.rooms.includes(roomId.toString()) && item.userId != userIdFromTheToken) {
              console.log("we found one " , message)
              item.ws.send(JSON.stringify({
                type : "chat" ,
                roomId : roomId ,
                message : message 
              }))
            }
          })
          } catch (error:any) {
            throw new Error("Ws error occured when message came" , error.message)
          }
          
        }
      } catch (error) {
            console.log("An error has occured" , error)
      }
      
    });
  } catch (error) {
    console.log("An error has occured" , error)
  }
  
});
