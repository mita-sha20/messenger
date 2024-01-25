import React from 'react';
import './style.css';
import { AiOutlineSearch } from 'react-icons/ai';
const Searchbox = () => {
  return (
    <>

      <div className="search-wrapper">
        <div className="search-icons">
        <AiOutlineSearch/>
        </div>
        <div className="search-fill">
            <input type="text" placeholder="search here.."/>
        </div>
      </div>

    </>
   
  )
}

export default Searchbox;
