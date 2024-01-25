import React, { useEffect, useState } from 'react'
import "./style.css";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
const Grouplist = () => {
  const [randomgroup,setrandomgroup]=useState([]);
  const [open, setOpen] = React.useState(false);
  const user=useSelector((users)=>users.loginSlice.login); 
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupname,setgroupname]=useState("");
  const [grouptag,setgrouptag]=useState("");
  const db = getDatabase();
  const handleCreate=()=>{
  set(push(ref(db, "groups")),{
    groupname: groupname,
    grouptag: grouptag,
    adminname: user.displayName,
    adminid: user.uid,
   }).then(()=>{
    setOpen(false);
   });
};

useEffect(()=>{
  const starCountRef = ref(db, "groups");
  onValue(starCountRef, (snapshot) => {
    const groupArr=[];
    snapshot.forEach((item)=>{
      if(user.uid != item.val().adminid){
        groupArr.push({...item.val(),id:item.key});
      }
    });
    setrandomgroup(groupArr);
  });
 },[]);  

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const handleJoinGroup =(item)=>{
    set(push(ref(db, "groupjoinreq")),{
      groupid:item.id,
      groupname:item.groupname,
      grouptag:item.grouptag,
      adminid:item.adminid,
      adminname:item.adminname,
      userid:user.uid,
      username:user.displayName,
     });
  };
  return (
    <>
    <div className="grouplist">
      <div className="grouplist-header">
        <h4>Grouplist</h4>
        <div className="groups-creation">
           <Button variant="contain" onClick={handleOpen}>Create Group</Button>
        </div>
      </div>
      {
        randomgroup.length ==0 ? <Alert severity="error">no group has created</Alert> 
        : randomgroup.map((item)=>(
          <div className="group-list-wrapper">
        <div className="group-images"></div>
        <div className="group-name">
          <span>Admin:{item.adminname}</span>
            <h5>{item.groupname}</h5>
            <span>{item.grouptag}</span>
        </div>
        <div className="group-btns">
            <button onClick={()=>handleJoinGroup(item)} type="button">Join</button>
        </div>
      </div>
        )) 
      }
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create new group
          </Typography>
         
          <TextField className="inputs" id="outlined-basic" label="Group Name" variant="outlined" onChange={(e)=>setgroupname(e.target.value)} fullWidth/>
        
          <TextField className="inputs" id="outlined-basic" label="Group Tagline" variant="outlined" onChange={(e)=>setgrouptag(e.target.value)}
          fullWidth/>
          <Button className="create-btn" variant="contain" onClick={handleCreate}>Create Your Group</Button>
        </Box>
      </Modal>
    </div>

    </>
    
  )
}

export default Grouplist;
