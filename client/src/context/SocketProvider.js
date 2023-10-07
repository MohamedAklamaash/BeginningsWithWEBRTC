import React,{createContext,useMemo,useContext} from "react";
import {io} from "socket.io-client"
const SocketContext = createContext(null);
const socket = io("http://localhost:8001");
export const useSocket = ()=>{
    return socket;
}

export const SocketProvider = (props)=>{
    const socket = useMemo(()=>io("http://localhost:8001"),[])
    return(
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}