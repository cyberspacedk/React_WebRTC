import React, {createContext, useState, useRef, useEffect} from 'react' 
import {io} from "socket.io-client";
import Peer from "simple-peer";

export interface ICtxProps  {
    clientName: string;
    setClientName: (name: string) => void;
    me: string;
    stream: MediaStream,
    call: ICall
    callAccepted: boolean
    callEnded: boolean
    callUser: (id: string) => void;
    answerCall: () => void;
    leaveCall: () => void;
    userVideoRef: IMediaRef,
    myVideoRef: IMediaRef
}

export const SocketContext = createContext<ICtxProps | {}>({});

const socket = io("http://localhost:5000");

type Media = MediaStream | undefined
interface IMediaRef {
    srcObject: Media
}
interface ICall {
    isRecievedCall: boolean,
    from?: string,
    signal: string,
    name?: string
}

export const SocketProvider: React.FC = ({children}) => {
    const [stream, setStream] = useState<Media>(undefined);
    const [me, setMe] = useState("");
    const [clientName, setClientName] = useState("");
    const [call, setCall] = useState<ICall>({
        isRecievedCall: false,
        from: "",
        signal: "",
        name: ""
    });
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);


    const myVideoRef = useRef<Partial <IMediaRef> | HTMLVideoElement>({});
    const userVideoRef = useRef<Partial <IMediaRef>>({});
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

        // listen event
        socket.on("me", id => {
            setMe(id)
        });

        socket.on("calluser", data => {
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
    console.log("calluser ~ id", id)
        const peer = new Peer({
            initiator: true, 
            trickle: false,
            stream
        });

        peer.on("signal", (data)=> {
            socket.emit("calluser", { 
                userToCall: id,
                signalData: data,
                from: me,
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
        setClientName,
        me,
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