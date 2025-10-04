import axios from "axios";
import { HTTP_BACKEND } from "../config";

function createNewRoom () {
    await axios.post(`${HTTP_BACKEND}/`)
}