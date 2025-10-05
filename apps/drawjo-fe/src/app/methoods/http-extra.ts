import axios from "axios";
import { HTTP_BACKEND } from "../../../config";
// import { headers } from "next/headers";

export async function createNewRoom (name : string) {
    const AuthToken = localStorage.getItem('token')  ;
    const roomCreate = await axios.post(`${HTTP_BACKEND}/create-room` , {
        name : name
    } ,  {
        headers : {
            authorization : AuthToken
        }
    })
    if (roomCreate.data.roomid) {
        alert("room has been created the id is" + roomCreate.data.roomid)
    }

}