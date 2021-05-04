import React, {useContext} from 'react';
import  {Button } from "@material-ui/core"; 

import {SocketContext, ICtxProps} from "../context/SocketCtx"

export const Notifications: React.FC = () => {
    const {answerCall, call, callAccepted} = useContext(SocketContext) as ICtxProps;

    return (
        <>
            {call.isRecievedCall && !callAccepted && (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <h1>{call.name} is calling: </h1>
                    <Button 
                      variant="contained"   
                      color="primary"
                      onClick={answerCall}
                    >
                        Answer
                    </Button>
                </div>
            )}
        </>
    )
}