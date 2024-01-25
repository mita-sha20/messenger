import React from 'react'
import { AiOutlineHome } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { IoIosNotifications } from 'react-icons/io';
import { RxGear } from 'react-icons/rx';
import { Link, NavLink } from 'react-router-dom';


const Sidebaricons = () => {
  return (
    <div className="icons">
       <NavLink className="sidebar_icons" to="/">
       <AiOutlineHome/>
       </NavLink>
       <NavLink className="sidebar_icons" to="/message">
       <FaComment/>
       </NavLink>
       <div className="sidebar_icons">
       <IoIosNotifications/>
       </div>
       <NavLink className="sidebar_icons" to="/accountinfo">
       <RxGear/>
       </NavLink>
    </div>
  )
}

export default Sidebaricons;
