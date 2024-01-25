import React from 'react';
import "./style.css";
import { useSelector } from 'react-redux';
import Accountname from './Accountname';
import Darkmood from '../../components/Darkmood';


const Accountinfo = () => {
  const users = useSelector((user) => user.loginSlice.login);
  return (
    <>
     <div className="main-acc-info">
      <div className="theme">
         <Darkmood/>
      </div>
     <div className="account-info">
<div className="acc-infobox">
<div className="pro-pic">
<img src={users.photoURL} loading="lazy" alt="photo"/>
</div>
<div className="account-form-box">
<Accountname/>
</div>
</div>
    </div>
     </div>
    </>
  )
}

export default Accountinfo;
