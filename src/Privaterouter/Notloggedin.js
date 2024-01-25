import Login from "../pages/Login";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Notloggedin(){
    const user = useSelector((users)=>
       users.loginSlice.login
    );
    return user ? <Navigate to="/"/> : <Outlet/>;
}