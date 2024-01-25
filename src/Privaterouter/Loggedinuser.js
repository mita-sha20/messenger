import Login from "../pages/Login";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function Loggedin(){
    const user = useSelector((users)=>
       users.loginSlice.login
    );
    return user ? <Outlet/> : <Login/>;
}