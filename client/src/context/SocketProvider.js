import React,{createContext,useMemo,useContext} from "react";
import {io} from "socket.io-client"
const SocketContext = createContext(null);
const socket = io("https://vc-backend-one.vercel.app");
export const useSocket = ()=>{
    return socket;
}

export const SocketProvider = (props)=>{
    const socket = useMemo(()=>io("https://vc-backend-one.vercel.app"),[])
    return(
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}