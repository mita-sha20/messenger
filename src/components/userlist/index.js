import React, { useEffect, useState } from 'react';
import "./style.css";
import { getDatabase, ref, onValue, set, push} from "firebase/database";
import { useSelector } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
// import Rootcomponent from '../rootcomponent/Rootcomponent';
// import { Userdata } from './data';
const Userlist = () => {
  const [userlists,setUserlists]=useState([]);
  const [frndreq,sentFrndreq]=useState([]);
  const [frndlist,sentFrndlist]=useState([]);
  const [filteruser,setfilteruser]=useState([]);
  const user=useSelector((users)=>users.loginSlice.login); 
  const db = getDatabase();

  useEffect(()=>{
    const starCountRef = ref(db, "users");
    onValue(starCountRef, (snapshot) => {
      const userarr=[];
     snapshot.forEach((userlists)=>{
      if(user.uid != userlists.key){
        userarr.push({...userlists.val(),id:userlists.key});
      }
     });
      setUserlists(userarr);
    });
  },[]);
  //sent request

  const handleSentRequest=(item)=>{
    set(push(ref(db, "friendrequest")), {
      sendername: user.displayName,
      senderid: user.uid,
      recivername:item.username,
      reciverid:item.id,
    });
  };
//friendlist
  useEffect(()=>{
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      const frndarr=[];
     snapshot.forEach((item)=>{
      frndarr.push(item.val().reciverid + item.val().senderid);
     });
      sentFrndlist(frndarr);
    });
  },[])
  console.log(frndlist);
  //show sent req
  useEffect(()=>{
    const starCountRef = ref(db, "friendrequest/");
    onValue(starCountRef, (snapshot) => {
      const reqarr=[];
     snapshot.forEach((item)=>{
      
        reqarr.push(item.val().reciverid + item.val().senderid);
      
     });
      sentFrndreq(reqarr);
    });
  },[]);
   const handleSearch=(e)=>{
    let arr=[]
    if(e.target.value.length == 0){
      setfilteruser([]);
    }
      userlists.filter((item)=>{
       if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
         arr.push(item);
         setfilteruser(arr);
       }
      }) 
   };
  return (
    <>
         {/* {
            Userdata.map((item,i)=>(
              <Rootcomponent key={i} image={item.image} name={item.name} button={item.button}/>
            )
            )
         }
        */}

         <div className="userlist">
         <div className="userlist-header">
           <h4>User Lists</h4>
         </div>
         <div className="search-wrapper">
        <div className="search-icons">
        <AiOutlineSearch/>
        </div>
        <div className="search-fill">
            <input onChange={handleSearch} type="text" placeholder="search here.."/>
        </div>
      </div>
{
  filteruser.length > 0 ? filteruser.map((item,i)=>(
    <div key={i} className="user-wrapper">
    <div className="user-images">

    </div>
    <div className="user-name">
     <h5>{item.username}</h5>
    </div>
    <div className="user-btns">
    
     {
      frndlist.includes(item.id + user.uid)
      ||
      frndlist.includes(user.uid + item.id)
      ?
      (<button type="button" disabled>Friends</button>)
      : frndreq.includes(item.id + user.uid) 
      || 
      frndreq.includes(user.uid + item.id)
      ? 
      (<button type="button" disabled>Cancel request</button>)
      : 
      (<button type="button" onClick={()=>handleSentRequest(item)}>Sent request</button>)
    } 
     
    </div>
   </div>

   )) :  userlists.map((item,i)=>(
    <div key={i} className="user-wrapper">
    <div className="user-images">

    </div>
    <div className="user-name">
     <h5>{item.username}</h5>
    </div>
    <div className="user-btns">
    
     {
      frndlist.includes(item.id + user.uid)
      ||
      frndlist.includes(user.uid + item.id)
      ?
      (<button type="button" disabled>Friends</button>)
      : frndreq.includes(item.id + user.uid) 
      || 
      frndreq.includes(user.uid + item.id)
      ? 
      (<button type="button" disabled>Cancel request</button>)
      : 
      (<button type="button" onClick={()=>handleSentRequest(item)}>Sent request</button>)
    } 
     
    </div>
   </div>

   ))
}

   
       </div>
    </>
  );
};

export default Userlist;
