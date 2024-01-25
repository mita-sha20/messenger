import React from 'react'
import "./style.css";

const Rootcomponent = ({image,name,button}) => {
  return (
    <>
    <div className="root-wrapper">
      <div className="root-images">
        <img src={image} alt=""/>
      </div>
      <div className="root-names">
        <h5>{name}</h5>
      </div>
      {
        button && (
          <div className="root-btns">
        <button type="button">{button}</button>
      </div>
        )
      }
    </div>
    </>
  )
}

export default Rootcomponent;
