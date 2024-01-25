import React, { useEffect, useState } from 'react'
import "./style.css";
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import { useSelector } from 'react-redux';
const Friendrequest = () => {

  const user=useSelector((users)=>users.loginSlice.login); 
  const [frndreq,sentFrndreq]=useState([]);
  const db = getDatabase();
  useEffect(()=>{
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      const reqArr=[];
     snapshot.forEach((item)=>{
       if(
        item.val().reciverid == user.uid
       ){
        reqArr.push({...item.val(),id:item.key});
       }
     });
      sentFrndreq(reqArr);
    });
  },[])

  //accept req

  const handleAccept=(data)=>{
    set(push(ref(db, "friends")), {
      ...data,
    }).then(()=>{
      remove(ref(db, "friendrequest/" + data.id))
    });
  }
console.log(frndreq);
  return (
    <>
      <div className="friendreq">
        <div classNam="frnd-header">
          <h4>Friend request</h4>
        </div>
        
       {frndreq.map((item,i)=>(
    <div className="frndreq-wrapper">
    <div className="frndreq-images">
    </div>
    <div className="frndreq-name">
    <h5>{item.sendername}</h5>
    </div>
    <div className="frndreq-btns">
    <button type="button" onClick={()=>handleAccept(item)}>Accept</button>
    <button type="button">Reject</button>
    </div>
    </div>
       ))
    
       }
           
          
      </div>
    </>
   
  )
}

export default Friendrequest;
