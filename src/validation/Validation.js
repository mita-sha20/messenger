import * as Yup from 'yup';

export const signUp = Yup.object({
  fullname: Yup.string().min(3).max(15).required("Please Enter Your Firstname"),
  email: Yup.string().email().required("Please Enter Your Email"),
  password: Yup.string().min(8).required("Please Enter Your Password"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password Must Matched")
    .required("Confirm password must be required"),
});

export const signIn = Yup.object({
  email: Yup.string().email().required("Please Enter Your Email"),
  password: Yup.string().min(8).required("Please Enter Your Password"),
});