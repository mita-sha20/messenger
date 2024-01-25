import React from 'react';
import Sidebaricons from './Sidebaricons';
import "./style.css";
import { MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loginuser } from '../../features/Slice/UserSlice';
import { getAuth, signOut } from "firebase/auth";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Popup from '../Modal';

const Sidebar = () => {
   const users = useSelector((user) => user.loginSlice.login);
   const [open, setOpen] = React.useState(false);
   // const handleClose=()=>setOpen(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const auth = getAuth();
   const handlelogout=()=>{
      signOut(auth).then(()=>{
         localStorage.removeItem("users");
         dispatch(Loginuser(null));
         navigate("/");
      }).catch((error)=>{
         console.log(error.message);
      });
   };

   const handleOpen = () =>{
    setOpen(true);
   };
    
  return (
   <>
   <div className="sidebar">
      <div className="sidebar_wrapper">
         <div className="profile_details">
         <div className="profile_picture" 
         onClick={handleOpen}><picture>
               <img src={users.photoURL} alt=""/>
         </picture>
            <div className="profile_overlay">
         <AiOutlineCloudUpload/>
         </div>
         </div>
          <div className="username">
         <h4>{users.displayName}</h4>
         </div>
         </div>
         <div className="others_page">
         <Sidebaricons/>
         </div>
         <div className="logout" onClick={handlelogout}>
         <MdLogout/>
         </div>
      </div>
   </div>
    <Popup open={open} setOpen={setOpen}/>  
   </>
  );
};

export default Sidebar;
