import React, { useRef, useState } from 'react'
import "./style.css"
import { BsThreeDotsVertical } from 'react-icons/bs';
import ModalImage from "react-modal-image";
import { BsEmojiLaughing } from 'react-icons/bs';
import { BsPlusLg } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { AiOutlineCamera } from 'react-icons/ai';
import { GrGallery } from 'react-icons/gr';
import { MdKeyboardVoice } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set, push} from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL, uploadString, uploadBytes} from "firebase/storage";
import { useEffect } from 'react';
import Lottie from "lottie-react";
import conversation from '../../svg/conversation.json'
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';
import ReactDOM from "react-dom/client";
import { AudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';


const Chatting = () => {
   const [open,setopen]=useState(false);
   const [opencam,setopencam]=useState(false);
   const [opengal,setopengal]=useState(false);
   const [msg,setmsg]=useState("");
   const [grpmsg,setgrpmsg]=useState("");
   const [grpmsgList,setgrpmsgList]=useState([]);
   const [grpmembers,setgrpmembers]=useState([]);
   const [msgList,setmsgList]=useState([]);
   const [audioURL,setaudioURL]=useState("");
   const [blob,setblob]=useState("");
   const [showaudio,setshowaudio]=useState(false);
   const [showemoji,setshowemoji]=useState(false);
   const [captureImg,setCaptureimg]=useState("");
   const scrollmsg=useRef();
   const choosefile=useRef(null);
   const db = getDatabase();
   const storage = getStorage();
   const activeChatName=useSelector((active)=>active.activeChat.active);
   const user=useSelector((users)=>users.loginSlice.login); 
   //camera capture
   function handleTakePhoto (dataUri) {
      setCaptureimg(dataUri);
      const storageRef = sref(storage, uuidv4());
      uploadString(storageRef, dataUri, 'data_url').then((snapshot) => {
         getDownloadURL(storageRef).then((downloadURL) => {
            set(push(ref(db, "singlemsg")), {
               whosendid: user.uid,
               whosendname:user.displayName,
               whorecieveid:activeChatName?.id,
               whorecievename:activeChatName?.name,
               img:downloadURL,
               date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
              }).then(()=>{
               setopencam(false);
              });
          });
       });
    }

       
//send msg
const handleSendmsg=()=>{
 
   if(activeChatName?.status=="Single"){
      set(push(ref(db, "singlemsg")), {
        whosendid: user.uid,
        whosendname:user.displayName,
        whorecieveid:activeChatName?.id,
        whorecievename:activeChatName?.name,
        msg:msg,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
       });
   }else{
      set(push(ref(db, "groupmsg")), {
         whosendid: user.uid,
         whosendname:user.displayName,
         whorecieveid:activeChatName?.id,
         whorecievename:activeChatName?.name,
         adminid:activeChatName?.adminid,
         msg:msg,
         date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
        });
   }
};
//get all msg
useEffect(()=>{
   onValue(ref(db,"singlemsg"),(snapshot)=>{
      let singlemsgArr=[];
      snapshot.forEach((item)=>{
         if(item.val().whosendid == user.uid &&
          item.val().whorecieveid == activeChatName?.id || item.val().whorecieveid == user.uid && 
          item.val().whosendid == activeChatName?.id){
           singlemsgArr.push(item.val()) ;
         }
         setmsgList(singlemsgArr);
      });
   })
},[activeChatName?.id]);


// get group msg
useEffect(()=>{
   onValue(ref(db,"groupmsg"),(snapshot)=>{
      let grpmsgArr=[];
      snapshot.forEach((item)=>{
       grpmsgArr.push(item.val());
      });
      setgrpmsgList(grpmsgArr);
   });
   
},[activeChatName?.id]);


// get group members
useEffect(()=>{
   onValue(ref(db,"groupmembers"),(snapshot)=>{
      let membersArr=[];
      snapshot.forEach((item)=>{
         membersArr.push(item.val().groupid + item.val().userid); 
      });
      setgrpmembers(membersArr);
   })
},[]);

//image upload
const handleImage=(e)=>{
   console.log(e.target.files[0]);
   const storageRef = sref(storage, e.target.files[0].name);

const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

uploadTask.on('state_changed', 
  (snapshot) => {
    
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    console.log("error",error);
  }, 
  () => {

    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      set(push(ref(db, "singlemsg")), {
         whosendid: user.uid,
         whosendname:user.displayName,
         whorecieveid:activeChatName?.id,
         whorecievename:activeChatName?.name,
         img:downloadURL,
         date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
        })
    });
  }
);

};

//for audio

const addAudioElement = (blob) => {
   const url = URL.createObjectURL(blob);
   setaudioURL(url);
   setblob(blob);
 };

const handleEnterPress=(e)=>{
   if(e.key == "Enter"){
   if(activeChatName?.status=="Single"){
      set(push(ref(db, "singlemsg")), {
        whosendid: user.uid,
        whosendname:user.displayName,
        whorecieveid:activeChatName?.id,
        whorecievename:activeChatName?.name,
        msg:msg,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
       });
   }else{
      console.log("group msg")
   }
   }
}

const handleAudioUp=()=>{
   const audiostorageRef = sref(storage, audioURL);

   uploadBytes(audiostorageRef, blob).then((snapshot) => {
      getDownloadURL(audiostorageRef).then((downloadURL)=>{
         set(push(ref(db, "singlemsg")), {
            whosendid: user.uid,
            whosendname:user.displayName,
            whorecieveid:activeChatName?.id,
            whorecievename:activeChatName?.name,
            audio:downloadURL,
            date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
           }).then(()=>{
            setaudioURL("")
           });
      })
    });
    
}

// emoji select

const handleemojiselect=(emoji)=>{
   setmsg(msg + emoji.emoji);
   setgrpmsg(grpmsg + emoji.emoji);
}

//scrollmsg

useEffect(()=>{
   scrollmsg?.current?.scrollIntoView();
},[msgList]);

  return (
   <>
    <div className="chatting-box">
       <div className="active-user">
         <div className="user-image">
            <div className="image"></div>
            <div className="info">
                <h5>{activeChatName?.name}</h5>
                <span>online</span>
            </div>
         </div>
         <div className="info-bar">
            <BsThreeDotsVertical/>
         </div>
       </div>
       <div className="message">
         
           { activeChatName?.status == "Single" 
            
            ? msgList.map((item,i)=>
            <div ref={scrollmsg}>
               {
                   item.whosendid == user.uid ? 
                   item.msg ? 
                   (
                      <>
                      <div className="right-msg" key={i}>
                   <div className="right-txt">
                    <p>{item.msg}</p>
                   </div>
                   <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
                </div>
                </>
                   )
                    : (
                      item.img ? (
                      <div className="right-msg">
                    <div className="right-img">
                    <ModalImage
                     small={item.img}
                     large={item.img}
                     alt="Hello World!"
        />
                    
                    </div>
                     <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
                  </div>
                    ) : (
                      <div className="right-msg">
                      <audio controls src={item.audio}></audio>
                      <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
                   </div> ) )
                     :  item.msg ? 
                     (
                        <>
                        <div className="left-msg" key={i}>
                     <div className="left-txt">
                      <p>{item.msg}</p>
                      
                     </div>
                     <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
                  </div>
                  </>
                     )   :   (
                         item.img ? (<div className="left-msg">
                         <div className="left-img">
                         <ModalImage
                          small={item.img}
                          large={item.img}
                          alt="Hello World!"
             />
                         
                         </div>
                          <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
                       </div>
                      ) : (
                         <div className="left-msg">
                         <audio controls src={item.audio}></audio>
                         <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
                      </div> )
    
                      )
                
               }
            </div>
            ) 
            : user?.uid == activeChatName?.adminid ||
            grpmembers.includes(activeChatName?.id + user.uid)
            ? 
            grpmsgList.map((item,i)=> (
            <div key={i}>
               {item.whosendid==user.uid ?
               item.whorecieveid == activeChatName?.id && 
               
               <div className="right-msg">
               <div className="right-txt">
                <p>{item.msg}</p>
               </div>
               <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
            </div>

               : item.whorecieveid == activeChatName?.id && 

               <div className="left-msg">
               <div className="left-txt">
                <p>{item.msg}</p>
                
               </div>
               <span>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</span>
            </div>

               }
            </div>
            )) : "not a grp member"
            // <div className="con">
            // <Lottie animationData={conversation} loop={true} />
            // </div>  

            }
       
         {/*...left msg start...*/}
          {/* <div className="left-msg">
             <div className="left-txt">
              <p>hello bro how are you?
              </p>
             </div>
             <span>Today,2:00pm</span>
          </div>
          
         
          <div className="right-msg">
             <div className="right-txt">
              <p>I'm fine and you? 
              </p>
             </div>
             <span>Today,2:10pm</span>
          </div>
          <div className="right-msg">
             <div className="right-txt">
              <p>I'm fine and you? Tell me something about you and your family. please
              </p>
             </div>
             <span>Today,2:10pm</span>
          </div>
          <div className="left-msg">
            <div className="left-img">
            <ModalImage
             small={"/images/samiha.jpg"}
             large={"/images/samiha.jpg"}
             alt="Hello World!"
/>
            
            </div>
             <span>Today,3:00pm</span>
          </div>
          <div className="right-msg">
             <div className="right-img">
             <ModalImage
             small={"/images/samiha.jpg"}
             large={"/images/samiha.jpg"}
             alt="Hello World!"
/>
             </div>
             <span>Today,2:10pm</span>
          </div>
          <div className="right-msg">
             <audio controls></audio>
             <span>Today,2:10pm</span>
          </div>
          <div className="left-msg">
          <audio controls></audio>
             <span>Today,3:00pm</span>
          </div>
          <div className="left-msg">      
          <video controls></video>
             <span>Today,3:00pm</span>
          </div> */}
          {/*work*/}
       </div>

       {
            activeChatName?.status == "Single" ? 
             <div className="msg-inputs">

         
            {
              !showaudio && !audioURL && <div className="txt-inputs">
              <input type="text" onKeyUp={handleEnterPress} onChange={(e)=>setmsg(e.target.value)
              }
              value={msg}/>
           
              <div className="emoji" onClick={()=>setshowemoji(!showemoji)}>
              <BsEmojiLaughing />
              </div>
           
              {showemoji && (<div className="emoji-picker">
              <EmojiPicker onEmojiClick={handleemojiselect}/>
              </div>)}
                        <div className="options">
                          <div onClick={()=>setopen(!open)}>
                          <BsPlusLg/>
                          </div>
                         
              
              {
              open && <div className="more">
              <div className="camera">
              <div onClick={()=>setopencam(true)}>
              <AiOutlineCamera/>
              </div>
              </div>
              <div className="gal">
              <label>
                 <input hidden onChange={handleImage} type="file"/>
                 <GrGallery/>
              </label>
              </div>
              
              
              
              <div className="voice">
              <div>
              <MdKeyboardVoice/>
              </div> 
              </div>
              </div>
              }
              
              </div>
              </div>
              
            }
                     <div className="recorder-btn" onClick={()=>{
                         setshowaudio(!showaudio) 
                       }}>
                       <AudioRecorder onRecordingComplete={(blob)=>addAudioElement(blob)}
               />
                       </div>
                  {
                    !showaudio && !audioURL && (
                       <button type="button" onClick={handleSendmsg}>
                       <FaTelegramPlane/>
                    </button>
           )}
           {
              audioURL && (<> 
              <div className="audio-wrapper">
              <audio controls src={audioURL}></audio>
               <div className="send-audio" onClick={handleAudioUp}>
                 <button>send</button>
               </div>
               <div className="dlt-audio" onClick={()=>{
                 setaudioURL("")
               }}>
                 <button>delete</button>
              </div>
              </div>
           </>
           )} 
                  </div> : 
                  user?.uid == activeChatName?.adminid ||
                  grpmembers.includes(activeChatName?.id + user.uid) ? 
                  <div className="msg-inputs">

         
            {
              !showaudio && !audioURL && <div className="txt-inputs">
              <input type="text" onKeyUp={handleEnterPress} onChange={(e)=>setgrpmsg(e.target.value)
              }
              value={grpmsg}/>
           
              <div className="emoji" onClick={()=>setshowemoji(!showemoji)}>
              <BsEmojiLaughing /> 
              </div>
           
              {showemoji && (<div className="emoji-picker">
              <EmojiPicker onEmojiClick={handleemojiselect}/>
              </div>)}
                        <div className="options">
                          <div onClick={()=>setopen(!open)}>
                          <BsPlusLg/>
                          </div>
                         
              
              {
              open && <div className="more">
              <div className="camera">
              <div onClick={()=>setopencam(true)}>
              <AiOutlineCamera/>
              </div>
              </div>
              <div className="gal">
              <label>
                 <input hidden onChange={handleImage} type="file"/>
                 <GrGallery/>
              </label>
              </div>
              
              
              
              <div className="voice">
              <div>
              <MdKeyboardVoice/>
              </div> 
              </div>
              </div>
              }
              
              </div>
              </div>
              
            }
                     <div className="recorder-btn" onClick={()=>{
                         setshowaudio(!showaudio) 
                       }}>
                       <AudioRecorder onRecordingComplete={(blob)=>addAudioElement(blob)}
               />
                       </div>
                  {
                    !showaudio && !audioURL && (
                       <button type="button" onClick={handleSendmsg}>
                       <FaTelegramPlane/>
                    </button>
           )}
           {
              audioURL && (<> 
              <div className="audio-wrapper">
              <audio controls src={audioURL}></audio>
               <div className="send-audio" onClick={handleAudioUp}>
                 <button>send</button>
               </div>
               <div className="dlt-audio" onClick={()=>{
                 setaudioURL("")
               }}>
                 <button>delete</button>
              </div>
              </div>
           </>
           )} 
                  </div>
                  :"nai"
         }
         
      
       {
      opencam && <div className="capture-img">
         <div className="close" onClick={()=>setopencam(false)}>
          <RxCross1/>
         </div>
 <Camera
      onTakePhoto = { (dataUri) => {handleTakePhoto(dataUri); 
      }}
      isFullscreen={false}
    />
      </div> 
      }
     
    </div>
   </>
  )
}

export default Chatting;
