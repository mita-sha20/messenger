import React, { useEffect, useState } from 'react'
// import Rootcomponent from '../rootcomponent/Rootcomponent';
import "./style.css";
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
// import { Mygroupsdata } from './data';

const Mygroups = () => {
  const [mygrouplist,setmygrouplist]=useState([]);
  const [groupReqlist,setgroupreqlist]=useState([]);
  const [member,setmember]=useState(false);
  const [groupmember,setgroupmember]=useState([]);
  const user=useSelector((users)=>users.loginSlice.login); 
  const [show,setshow]=useState(false);
  const db = getDatabase();
  useEffect(()=>{
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      const groupArr=[];
      snapshot.forEach((item)=>{
        if(user.uid == item.val().adminid){
          groupArr.push({...item.val(),id:item.key});
        }
      });
      setmygrouplist(groupArr);
    });
   },[]);  
    const handleReqShow = (gitem) =>{
      setshow(true);
      const starCountRef = ref(db, "groupjoinreq");
      onValue(starCountRef, (snapshot) => {
        const groupreqArr=[];
        snapshot.forEach((item)=>{
          if(user.uid == item.val().adminid && item.val().groupid == gitem.id){
            groupreqArr.push({...item.val(),id:item.key});
          } 
        });
        setgroupreqlist(groupreqArr);
      });
    };
    const handleAcceptgrp = (item) =>{
      set(push(ref(db, "groupmembers")),{
        adminid:item.adminid,
        groupid:item.groupid,
        adminname:item.adminname,
        userid:item.userid,
        username:item.username,
        groupname:item.groupname,
       }).then(()=>{
        remove(ref(db,"groupjoinreq/"+item.id));
       });
    };

    const handleMembershow=(groupmem)=>{
        setmember(true);
        const starCountRef = ref(db, "groupmembers");
        onValue(starCountRef, (snapshot) => {
          const memberArr=[];
          snapshot.forEach((item)=>{
            if(user.uid == groupmem.adminid && groupmem.id == item.val().groupid){
              memberArr.push({...item.val(),id:item.id});
            } 
          });
          setgroupmember(memberArr);
        });
    };
  return (
   <>
     {/* {
        Mygroupsdata.map((item,i)=>(
            <Rootcomponent key={i} image={item.image} name={item.name} button={item.button}/>
        )
        )
     } */}
     <div className="my-groups">
     <div className="mygroups-header">
       <h4>My Groups</h4> 
       </div>
      {
        member && <button onClick={()=>setmember(false)} type="button">Go Back</button>
      }
      {
        show && <button onClick={()=>setshow(false)} type="button">Go Back</button>
      }
        {mygrouplist.length == 0 
        ? <Alert severity="error">no group has created</Alert> 
        : show ? groupReqlist.length == 0 ? <Alert severity="error">no request show</Alert>
        : groupReqlist.map((item,i)=>(
          <div className="mygroups-wrapper">
          <div className="mygroups-images">
          </div>
          <div className="mygroups-name">
          <h5>{item.username}</h5>
          </div>
          <div className="mygroups-btns">
          <button type="button">Reject</button>
          <button type="button" onClick={()=>handleAcceptgrp(item)}>Accept</button>
          </div>
          </div>
  )) : member ? groupmember.map((item,i)=>(
    <div className="mygroups-wrapper">
    <div className="mygroups-images">
    </div>
    <div className="mygroups-name">
    <h5>{item.username}</h5>
    </div>
    </div>
  )) :
     mygrouplist.map((item,i)=>(
    <div className="mygroups-wrapper">
    <div className="mygroups-images">
    </div>
    <div className="mygroups-name">
      <span>Admin:{item.adminname}</span>
    <h5>{item.groupname}</h5>
    <span>{item.grouptag}</span>
    </div>
    <div className="mygroups-btns">
    <button type="button" onClick={()=>handleMembershow(item)}>Info</button>
    <button type="button" onClick={()=>handleReqShow(item)}>Request</button>
    </div>
    </div>
  )
          )
         }
        
      
       
   
    </div>
  
   
   </>
  )
}

export default Mygroups;
