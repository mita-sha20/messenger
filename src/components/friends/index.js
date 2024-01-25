import React, { useEffect, useState } from 'react'
import "./style.css";
import { getDatabase, ref, onValue,set ,push, remove} from "firebase/database";
import { useSelector,useDispatch } from 'react-redux';
import { activeChat } from '../../features/Slice/activeSingle';
// import { activechat } from '../../features/Slice/activesingleSlice';
const Friends = () => {
  const[frndlist,setfrndlist]=useState([]);
  const user=useSelector((users)=>users.loginSlice.login); 
  const dispatch=useDispatch();
  const db = getDatabase();
 useEffect(()=>{
  const starCountRef = ref(db, "friends");
  onValue(starCountRef, (snapshot) => {
    const frndArr=[];
   snapshot.forEach((item)=>{
    if(user.uid==item.val().reciverid||user.uid==item.val().senderid){
      frndArr.push({...item.val(), id:item.key});
    }
   });
    setfrndlist(frndArr);
  });
 },[])

 //block

 const handleBlock=(item)=>{
  if(user.uid == item.senderid){
    set(push(ref(db, "block")),{
      block: item.recivername,
      blockid: item.reciverid,
      blockedby: item.sendername,
      blockedbyid: item.senderid,
    }).then(()=>{
      remove(ref(db, "friends/"+ item.id));
    });
  }else{
    set(push(ref(db, "block")),{
      block: item.sendername,
      blockid: item.senderid,
      blockedby: item.recivername,
      blockedbyid: item.reciverid,
    }).then(()=>{
      remove(ref(db, "friends/"+ item.id));
    });
  }
 }
//activesingle
const handleActivesingle=(item)=>{
  if(item.reciverid==user.uid){
    dispatch(activeChat({
      status:"Single",
      id:item.senderid,
      name:item.sendername,
    })
    );
    // localStorage.setItem("activeSingle",JSON.stringify(item));
  }else{
    dispatch(activeChat({
      status:"Single",
      id:item.reciverid,
      name:item.recivername,
    })
    );
  }
}
  return (
    <>
    <div className="friends">
    <div classNam="friends-header">
          <h4>Friends</h4>
        </div>
        {
          frndlist.map((item,i)=>(
            <div className="friends-wrapper" key={i} onClick={()=>handleActivesingle(item)}>
            <div className="friends-images">
   
            </div>
            <div className="friends-name">
             <h5>{user.uid == item.senderid ? item.recivername : item.sendername}</h5>
            </div>
            <div className="friends-btns">
             <button type="button" onClick={()=>handleBlock(item)}>Block</button>
             <button type="button">Unfriend</button>
            </div>
           </div>
           
          ))
        }
    </div>
    </>
  )
}

export default Friends;
