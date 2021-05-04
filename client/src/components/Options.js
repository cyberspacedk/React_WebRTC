import React, {useState, useContext} from 'react';
import  {Button, TextField, Container, Grid, Typography, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Assignment, Phone, PhoneDisabled} from "@material-ui/icons"
import {CopyToClipboard} from "react-copy-to-clipboard"

import {SocketContext} from "../context/SocketCtx"

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridContainer: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    container: {
      width: '600px',
      margin: '35px 0',
      padding: 0,
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: '10px 20px',
      border: '2px solid black',
    },
   }));

export const Options = ({children}) => {
    const [idToCall, setIdToCall] = useState("");
    const {
        me,
        clientName,
        setClientName,
        callAccepted, 
        callEnded, 
        leaveCall,
        callUser
    } = useContext(SocketContext);

    const classes = useStyles(); 

    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid  container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Account info
                            </Typography>
                            <TextField 
                                fullwidth
                                label="Name" 
                                value={clientName} 
                                onChange={({target}) => setClientName(target.value)} 
                            />
                            <CopyToClipboard text={me} className={classes.margin}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<Assignment fontSize="large"/>}
                                >
                                    Copy your ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Make a call
                            </Typography>
                            <TextField 
                                fullwidth
                                label="ID to call" 
                                value={idToCall} 
                                onChange={({target}) => setIdToCall(target.value)} 
                            />
                            {callAccepted && !callEnded ? (
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    color="secondary" 
                                    startIcon={<PhoneDisabled fontSize="large"/>}
                                    className={classes.margin}
                                    onClick={leaveCall}
                                 >
                                     Hang Up 
                                 </Button>
                            ) : (
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<Phone fontSize="large"/>}
                                    className={classes.margin}
                                    onClick={()=> callUser(idToCall)}
                                >
                                    Call
                                </Button> 
                            )} 
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {children}
        </Container>
    )
}