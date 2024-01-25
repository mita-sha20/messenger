import React from 'react';
import "./style.css";
import Cropper from "react-cropper";
import Button from '@mui/material/Button';
import "cropperjs/dist/cropper.css";
import { AiOutlineClose } from 'react-icons/ai';

const Imagecropper = ({image , setCropper , setImage , cropData , getCropData}) => {
  return (
    <>
    <div className="crop-image-box">
        <div className="upload-header">
          <h4>Upload profile picture</h4>
          <div className="close" onClick={()=>setImage()}>
             <AiOutlineClose/>
          </div>
        </div>
        <div className="preview-img">

        <div className="img-preview">

        </div>
           
        </div>
        <div className="crop-images">
        <Cropper
          style={{ height: 400, width: "100%" }}
          zoomTo={0.5}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} 
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        /> 
        </div> 
       <div className="upload-btn" onClick={getCropData}>
       <Button variant="contained">Upload Now</Button>
       </div>
    </div>
    </>
  )
}

export default Imagecropper;