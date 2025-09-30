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
        const parsedData = JSON.parse(data as unknown as string)  // {type : "join_room" , room_id : "232"}
      
        if (parsedData.type === "join_room") {
          const user = UserState.find(x => x.ws === ws);
          // check if the room exists and credential support etc
          // everyone should have auth 
          user?.rooms.push(parsedData.room_id)
          console.log(UserState)
        }
        
        if (parsedData.type === "leave_room") {
            const user = UserState.find(x => x.ws === ws);
            if (!user || !user.rooms) return ; 
            user.rooms = user?.rooms.filter(x => x !== parsedData.room_id)
        }

        if (parsedData.type === "chat") {
          console.log("We are recieving or getting the data ig ??/" , UserState)
          const roomId = parsedData.room_id ;
          const message = parsedData.message ; 
          await prismaClient.chat.create({
            data : {
              roomId ,
              message ,
              userId : userIdFromTheToken, 
              adminId : userIdFromTheToken
            }
          })
          UserState.forEach(item => {
            if (item.rooms.includes(roomId) && item.userId != userIdFromTheToken) {
              item.ws.send(JSON.stringify({
                type : "chat" ,
                roomId ,
                message : message 
              }))
            }
          })
        }
      } catch (error) {
            console.log("An error has occured" , error)
      }
      
    });
  } catch (error) {
    console.log("An error has occured" , error)
  }
  
});
