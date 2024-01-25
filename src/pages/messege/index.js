import React from 'react'
import "./style.css";
import { Grid } from '@mui/material';
import Msggrp from '../../components/msggroup';
import Friends from '../../components/friends';
import Chatting from '../../components/chatting';
const Message = () => {
  return (
   <>
    <Grid container justifyContent="space-between">
        <Grid item xs={4} className="msg_item" marginTop={2}>
       <Msggrp/>
       <Friends/>
        </Grid>
        <Grid item xs={7}>
      <Chatting/>
        </Grid>
       
     </Grid>
   </>
  )
}

export default Message;
