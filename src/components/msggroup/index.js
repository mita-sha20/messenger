import React, { useEffect, useState } from 'react'
import "./style.css";
import { getDatabase, onValue, ref } from 'firebase/database';
import { useDispatch } from 'react-redux';
import { activeChat } from '../../features/Slice/activeSingle';

const Msggrp = () => {

  const [msggrp,setmsggrp]=useState([]);
  const db = getDatabase();
  const dispatch=useDispatch();

  useEffect(()=>{
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      const msggrpArr=[];
     snapshot.forEach((item)=>{
      
        msggrpArr.push({...item.val(),id:item.key});
       
     });
      setmsggrp(msggrpArr);
    });
  },[])

//active grp chat

 const handleActiveGroup =(item)=>{
  dispatch(
    activeChat({
        status:"groups",
        id: item.id,
        name: item.groupname,
        adminid: item.adminid,
      })
    
  );
 };
  return (
   <>
   <div className="msggrps">
    <div className="msggrps-header">
      <h5>All Groups</h5>
    </div>
    {
      msggrp.map((item,i)=>(
        <div className="msggrp-wrapper" key={i} onClick={()=>handleActiveGroup(item)}>
        <div className="msggrp-images"></div>
        <div className="msggrp-name">
         <h5>{item.groupname}</h5>
         <p>{item.grouptag}</p>
        </div>
        <div className="msggrp-btns">
           <button type="button">Message</button>
        </div>
      </div>
      ))
    }
  
      
   </div>
   </>
  )
}

export default Msggrp;
