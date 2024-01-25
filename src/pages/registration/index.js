import React from 'react'
import { useState } from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signUp } from '../../validation/Validation';
import BeatLoader from "react-spinners/BeatLoader";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Link , useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import "./style.css";

const Registration = () => {
    const db = getDatabase();
    const [passShow, setPassShow] = useState("password");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const handleShow = () => {
        if (passShow == "password") {
          setPassShow("text");
        } else {
          setPassShow("password");
        }
      };

      const intialValues = {
        fullname: "",
        email: "",
        password: "",
        confirmpassword: "",
      };
    
      const formik = useFormik({
        initialValues: intialValues,
        validationSchema: signUp,
        onSubmit: () => {
          setLoading(true);
          createUserWithEmailAndPassword(
            auth,
            formik.values.email,
            formik.values.password,
          )
            .then(({user}) => {
              updateProfile(auth.currentUser, {
               displayName: formik.values.fullname,
              }).then(()=>{
                sendEmailVerification(auth.currentUser).then(()=>{
                  set(ref(db, 'users/' + user.uid), {
                    username: user.displayName,
                    email: user.email,
                  }).then(()=>{
                    toast.success("please verify your email!",{
                      position: "bottom-center",
                      autoClose: 1000,
                      hideProgressBar: true,
                      pauseOnHover: false,
                    })
                    formik.resetForm();
                    setLoading(false);
                    navigate("/login");
                  })
                  });
              });
              })
            .catch((error) => {
              if (error.code.includes("auth/email-already-in-use")) {
                toast.error("Email already in use!", {
                  position: "bottom-center",
                  autoClose: 1000,
                  hideProgressBar: true,
                  pauseOnHover: false,
                });
                setLoading(false);
              }
            });
        },
      }); 

  return (
    <>
    <div className="main_box registration">
    <ToastContainer/>
      <Container fixed>
        
        <Grid className="box" container spacing={2}>
          <Grid item xs={6}>
            <div className="registration-left">
              <h3>Register and start journy with massenger</h3>
              <span>Free register and you can enjoy it</span>
              <form 
              onSubmit={formik.handleSubmit}
              >
                <TextField
                  className="inputs"
                  label="Full Name"
                  type="text"
                  name="fullname"
                  variant="standard"
                  onChange={formik.handleChange}
                  value={formik.values.fullname}
                />
                {formik.errors.fullname && formik.touched.fullname ? (
                  <p className="error_messasge">{formik.errors.fullname}</p>
                ) : null}

                <TextField
                  className="inputs"
                  label="Email"
                  type="email"
                  name="email"
                  variant="standard"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email ? (
                  <p className="error_messasge">{formik.errors.email}</p>
                ) : null}

                <div className="passord-box">
                  <TextField
                    className="inputs"
                    label="Password"
                    type={passShow}
                    name="password"
                    variant="standard"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <div className="register-eyes" onClick={handleShow}>
                    {passShow == "password" ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <p className="error_messasge">{formik.errors.password}</p>
                ) : null}

                <TextField
                  className="inputs"
                  label="Confirm Password"
                  type="password"
                  variant="standard"
                  name="confirmpassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmpassword}
                />
                {formik.errors.confirmpassword &&
                formik.touched.confirmpassword ? (
                  <p className="error_messasge">
                    {formik.errors.confirmpassword}
                  </p>
                ) : null}

                {loading ? (
                  <Button
                    disabled
                    className="register-btn"
                    type="submit"
                    variant="contained"
                  >
                    <BeatLoader className="loader" color="#fff" size={15} />
                  </Button>
                ) : (
                  <Button
                    className="register-btn"
                    type="submit"
                    variant="contained"
                  >
                    Sign up
                  </Button>
                )}
              </form>
              <div className="register-account">
                <p>
                  Already have an account ? 
                  <Link to="/login"> Sign In</Link>{" "}
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              <picture>
                <img
                  className="register_pic"
                  src="./images/register.png"
                  alt="register"
                />
              </picture>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
    </>
  )
}

export default Registration;
