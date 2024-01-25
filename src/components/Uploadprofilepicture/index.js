import React, { useRef, useState } from 'react';
import "./style.css";
import { IoMdImages } from 'react-icons/io';
import Imagecropper from './Imagecropper';
import { getStorage , ref, getDownloadURL , uploadString} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { Loginuser } from '../../features/Slice/UserSlice';

const Uploadprofile = ({setOpen}) => {
const [image,setImage]=useState();
const [cropData, setCropData] = useState("#");
const [cropper, setCropper] = useState();
const choosefile=useRef(null);
const user = useSelector((user) => user.loginSlice.login);
const auth=getAuth();
const storage = getStorage();
const storageRef = ref(storage, 'some-child');
const dispatch=useDispatch();
const handleUploadProfile=(e)=>{
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    }else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
      reader.readAsDataURL(files[0]);
    };
    const getCropData = () => {
        if (typeof cropper !== "undefined") {
          setCropData(cropper.getCroppedCanvas().toDataURL());
          const message4 = cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
                updateProfile(auth.currentUser, {
                 photoURL: downloadURL,
                  }).then(()=>{
                    setOpen(false);
                    dispatch(Loginuser({...user, photoURL:downloadURL}));
                    localStorage.setItem("users",JSON.stringify({...user, photoURL:downloadURL}))
                  });
              });
});

        }
    };
  
  return (
   <>
   <div className="upload-box">
    <input type="file" hidden ref={choosefile} onChange={handleUploadProfile}/>
    <div className="upload" onClick={()=>choosefile.current.click()}>
        <div className="upload-icon">
        <IoMdImages/>
        </div>
       <p>Upload photo</p>
    </div>

     {image && (<Imagecropper image={image} setCropper={setCropper} setImage={setImage} cropData={cropData} getCropData={getCropData}/>)} ;
     
   </div>
   </>
  );
};

export default Uploadprofile;