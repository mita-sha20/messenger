import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "./style.css";

const Block = () => {
  const [blockUser,setblockUser]=useState([]);
  const user=useSelector((users)=>users.loginSlice.login); 
  const db = getDatabase();
  useEffect(()=>{
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      const blockArr=[]
      snapshot.forEach((item)=>{
      if(item.val().blockedbyid==user.uid){
        blockArr.push(
          { 
            id:item.key,
            block:item.val().block,
            blockid:item.val().blockid,
          }
        )}else{
          blockArr.push(
            {
              id:item.key,
              blockedby:item.val().blockedby,
              blockedbyid:item.val().blockedbyid,
            }
          )
        }
      })
      setblockUser(blockArr);
    });
   },[])
  const handleUnblocked=(item)=>{
     set(push(ref(db, "friends")),{
      sendername:item.block,
      senderid:item.blockid,
      reciverid:user.uid,
      recivername:user.displayName,
     }
     ).then(()=>{
      remove(ref(db,"block/"+item.id))
     });
  };

  return (
    <>
    <div className="blocklist">
         <div className="block-header">
             <h4>Blocks</h4>
         </div>
       {
        blockUser.map((item,i)=>(
          <div className="block-wrapper" key={i}>
          <div className="block-images">
          </div>
          <div className="block-name">
          <h5>{item.block}</h5>
          <h5>{item.blockedby}</h5>
          </div>
          {!item.blockedbyid && <div className="block-btns">
            <button type="button" onClick={()=>handleUnblocked(item)}>Unblock</button>
            </div>
          } 
          </div>      
        ))
       } 
  
    </div>
    </>
  )
} 

export default Block;
