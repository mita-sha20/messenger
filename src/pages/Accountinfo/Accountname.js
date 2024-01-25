import { Button, TextField } from '@mui/material'
import React from 'react'
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
import { Loginuser } from '../../features/Slice/UserSlice';


const Accountname = () => {
    const users = useSelector((user) => user.loginSlice.login);
    const auth = getAuth();
    const db = getDatabase();
    const dispatch=useDispatch();
    const currentUser=auth.currentUser;
    const formik = useFormik({
        initialValues: {
            fullname: users.displayName,
            email: users.email,
            password: "",
          },
       onSubmit:()=>{
         handleUpdateProfile();

                 

        // updateProfile(auth.currentUser, {
        //   displayName: formik.values.fullname,
        //  }).then((user)=>{
           
        //  })
        // update(ref(db,"users/"+users.uid),{
        //   username: formik.values.fullname,
        // }).then(()=>{
        
        // });
       }
      }); 
      const handleUpdateProfile=async()=>{
        await updateProfile(auth.currentUser, {
            displayName: formik.values.fullname,
            }).then(async()=>{
             const userInfo={
              displayName: auth.currentUser.displayName,
             };
            await update(ref(db,"users/"+users.uid),{
                username: userInfo.displayName,
              });
             await updatePassword(currentUser,formik.values.password).then(()=>{
                console.log("newPassword");
              });
              dispatch(Loginuser({...users,displayName:formik.values.fullname}));
              localStorage.setItem("users",JSON.stringify({
                ...users,displayName:formik.values.fullname,
              }))
            });
      }; 
  return (
   <>
   <div>
    <form onSubmit={formik.handleSubmit}>
    <TextField
                  className="inputs"
                  label="Full Name"
                  type="text"
                  name="fullname"
                  variant="standard"
                  fullWidth
                 onChange={formik.handleChange}
                 value={formik.values.fullname}
                />
                 <TextField
                  className="inputs"
                  label="Email"
                  type="Email"
                  name="Email"
                  variant="standard"
                  fullWidth
                  disabled
                 onChange={formik.handleChange}
                 value={formik.values.email}
                />
                <TextField
                  className="inputs"
                  label="New Password"
                  type="password"
                  name="password"
                  variant="standard"
                  fullWidth
                 onChange={formik.handleChange}
                 value={formik.values.password}
                />
                <Button
                className="update-btn"
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    Update account
                  </Button>
    </form>
   </div>
   </>
  )
}

export default Accountname;
