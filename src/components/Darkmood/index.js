import React from 'react';
import "./style.css";
import Switch from '@mui/material/Switch';
import { useDispatch, useSelector } from 'react-redux';
import { Thememood } from '../../features/Slice/themeSlice';

const Darkmood = () => {
  const theme = useSelector((state)=>
  state.themeChange.Darkmood);
  const dispatch = useDispatch();
  const handleTheme=(e)=>{
    if(e.target.checked){
      dispatch(Thememood(true));
      localStorage.setItem("mode",true);
    }
    else
    {
      dispatch(Thememood(false));
      localStorage.removeItem("mode",false);
    }
  };
  return (
   <>
   <div className="theme-part">
   <Switch onChange={handleTheme} checked={theme}/>
   </div>
   </>
  )
}

export default Darkmood;
