import React from 'react'
import "./style.css";
import TextField from "@mui/material/TextField";
import { useFormik } from 'formik';
import Button from "@mui/material/Button";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const Forget = () => {

    const auth = getAuth();

    const resetPass = () => {
      sendPasswordResetEmail(auth, formik.values.email)
      .then(()=>{
        console.log("gese");
      })
      .catch((error)=>{
        console.log(error.message);
      });
     };
  
    const formik = useFormik({
      initialValues: {
        email:"",
      },
      onSubmit:()=>{
        resetPass();
      }
    });
  
  console.log(formik);

  return (
    <>
    <div className="main_forget_wrapper">
       <div className="inner_forget_box">
          <div className="forget_header">
            <h4>Reset your password</h4>

          </div>
          <div className="forget_pass_body">
            <form onSubmit={formik.handleSubmit}>
            <TextField
                  className="inputs"
                  label="Email"
                  type="email"
                  name="email"
                  variant="standard"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <Button className="btn" type="submit" variant="contained">
                    Reset
                  </Button>
            </form>
          </div>
       </div>


    </div>

    </>
  )
}

export default Forget
