import React, {useContext} from 'react';
import  {Grid, Typography, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import {SocketContext} from "../context/SocketCtx"

const useStyles = makeStyles(theme => ({
    video: { 
        width: "550px",
        [theme.breakpoints.down('xs')]: {
          width: '300px',
        },
      },

      gridContainer: {
        justifyContent:"center",
        [theme.breakpoints.down('xs')]:{
            flexDirection: "column"
        }
      },
      paper: {
          padding: "10px",
          border: "2px solid black",
          margin: "10px"
      }
}));

export const VideoPlayer = () => {
    const classes = useStyles();
    const {
        clientName, 
        callAccepted, 
        myVideoRef, 
        userVideoRef, 
        callEnded, 
        stream, 
        call
    } = useContext(SocketContext);;
        console.log("REF", myVideoRef)

    return (
        <Grid container className={classes.gridContainer}>
            {stream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            {clientName || "Name"}
                        </Typography>
                        <video playsInline muted autoPlay ref={myVideoRef} className={classes.video}/>
                    </Grid>
                </Paper>
            )}

            {callAccepted && !callEnded && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            {call.name || "Name"}
                        </Typography>
                        <video playsInline muted autoPlay ref={userVideoRef} className={classes.video}/>
                    </Grid>
                </Paper>
            )} 
        </Grid>
    )
}