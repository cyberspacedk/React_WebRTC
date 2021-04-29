import React, {createContext, useState, useRef, useEffect} from 'react' 
import {io} from "socket.io-client";
import Peer from "simple-peer";

interface ICtxProps  {
    clientName: string;
    socketId: string;
    stream: MediaStream,
    call: ICall
    callAccepted: boolean
    callEnded: boolean
    callUser: (id: string) => void;
    answerCall: () => void;
    leaveCall: () => void;
}
export const SocketContext = createContext<ICtxProps | {}>({});

const socket = io("http://localhost:5000");

type Media = MediaStream | undefined
interface IMediaRef {
    srcObject?: Media
}
interface ICall {
    isRecievedCall: boolean,
    from?: string,
    signal: string,
    name?: string
}

export const SocketProvider: React.FC = ({children}) => {
    const [clientName, setClientName] = useState("");
    const [socketId, setSocketId] = useState("");
    const [stream, setStream] = useState<Media>(undefined)
    const [call, setCall] = useState<ICall>({
        isRecievedCall: false,
        from: "",
        signal: "",
        name: ""
    });
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);


    const myVideoRef = useRef<IMediaRef>({});
    const userVideoRef = useRef<IMediaRef>({});
    const connectionRef = useRef<Peer.Instance>()


    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(currentStream => {
            setStream(currentStream); 
            myVideoRef.current.srcObject = currentStream; 
        });

        socket.on("me", id => {
            setSocketId(id)
        });

        socket.on("callUser", data => {
            const {from, name: callerName, signal} = data;
            setCall({
                isRecievedCall: true,
                from,
                signal,
                name: callerName
            });
        });
    }, []);

    const answerCall = ()=> {
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false, 
            trickle: false,
            stream
        });

        peer.on("signal", (data)=> {
            socket.emit("answercall", { 
                signal: data,
                to: call.from
            })
        });

        peer.on("stream", currentStream => {
            userVideoRef.current.srcObject = currentStream;
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    }

    const callUser = (id: string)=> {
        const peer = new Peer({
            initiator: true, 
            trickle: false,
            stream
        });

        peer.on("signal", (data)=> {
            socket.emit("calluser", { 
                userToCall: id,
                signalData: data,
                from: socketId,
                name: clientName
            })
        });

        peer.on("stream", currentStream => {
            userVideoRef.current.srcObject = currentStream;
        });

        socket.on("callaccepted", signal => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = ()=> {
        setCallEnded(true);
        connectionRef.current && connectionRef.current.destroy();
        window.location.reload();
    }

    const ctxValue = {
        clientName,
        socketId,
        stream,
        call,
        callAccepted,
        callEnded,
        callUser,
        answerCall,
        leaveCall,
        myVideoRef,
        userVideoRef
    }

    return (
        <SocketContext.Provider value={ctxValue}>
            {children}
        </SocketContext.Provider>
    )
}