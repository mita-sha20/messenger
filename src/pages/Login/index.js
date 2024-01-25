import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible , AiFillFacebook} from "react-icons/ai";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider ,signInWithPopup, FacebookAuthProvider, getRedirectResult } from "firebase/auth";
import BeatLoader from "react-spinners/BeatLoader";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import "./style.css";
import { useDispatch } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../validation/Validation";

const Login = () => {
  const [passShow, setPassShow] = useState("password");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const googleprovider = new GoogleAuthProvider();
  // const facebookprovider = new FacebookAuthProvider();
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleShow = () => {
    if (passShow == "password") {
      setPassShow("text");
    } else {
      setPassShow("password");
    }
  };

  const intialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: intialValues,
    validationSchema: signIn,
    onSubmit: () => {
      setLoading(true);
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({user}) => {
          if(auth.currentUser.emailVerified == true){
            navigate("/");
            dispatch(Loginuser(user));
            localStorage.setItem('users',JSON.stringify(user));
          }else{
            console.log("vai verify kore asho");
          }
        })
        .catch((error) => {
          if (error.code.includes("auth/user-not-found")) {
            toast.error("Invalid email", {
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

  const handleGoogleauth=()=>{
    signInWithPopup(auth, googleprovider).then(()=>{
      navigate("/");
    });

//     const handleFacebookauth =()=>{
//       getRedirectResult(auth, facebookprovider)
//       .then((result) => {
    
//         const credential = FacebookAuthProvider.credentialFromResult(result);
//         const token = credential.accessToken;
    
//         const user = result.user;
//   });
// }
  }
    // const handleFacebookAuth=()=>{
    //   signInWithPopup(auth, facebookprovider).then((result)=>{
    //     navigate("/");
    //     const user = result.user;
    //     const credential = FacebookAuthProvider.credentialFromResult(result);
    //     const accessToken = credential.accessToken;
    //   });

    // }

  
  return (
    <div className="main_box">
      <Container fixed>
        <ToastContainer />
        <Grid className="box" container spacing={2}>
          <Grid item xs={6}>
            <div>
              <picture>
                <img
                  className="register_pic"
                  src="./images/signin.png"
                  alt="register"
                />
              </picture>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="login-left">
              <div className="avatar">
                <picture>
                  <img src="./images/avatar.png" alt="avatar" />
                </picture>
              </div>
              <h3>Login to your account!</h3>
              <div className="authentication" onClick={handleGoogleauth}>
                <div className="auth-pic">
                  <picture>
                    <img src="./images/logo.png" alt=""/>
                  </picture>
                </div>
               
                <div className="auth-text">
                  <p>Login with Google</p>
                </div>
                </div>
               
                {/* <div className="authentication2" onClick={handleFacebookauth}>
                <div className="auth-pic2">
                 <AiFillFacebook/>
                </div>
               
                <div className="auth-text2 ">
                  <p>Login with Facebook</p>
                </div>
                </div> */}
          
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
                  <div className="eyes" onClick={handleShow}>
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
                {loading ? (
                  <Button
                    disabled
                    className="btn"
                    type="submit"
                    variant="contained"
                  >
                    <BeatLoader className="loader" color="#fff" size={15} />
                  </Button>
                ) : (
                  <Button className="btn" type="submit" variant="contained">
                    Sign In
                  </Button>
                )}
              </form>
              <div className="account">
                <Link to="/forgetpassword">Forget password</Link>
                <p>
                  Don't have an account? <Link to="/registration">Sign Up</Link>{" "}
                </p>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
