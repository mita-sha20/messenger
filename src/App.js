import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/registration";
import Home from "./pages/Home";
import Loggedin from "./Privaterouter/Loggedinuser";
import Notloggedin from "./Privaterouter/Notloggedin";
import Forget from "./pages/ForgetPassword";
import RootLayout from "./Layout";
import Message from "./pages/messege";
import Accountinfo from "./pages/Accountinfo";
import { useSelector } from "react-redux";


function App() {
  const theme = useSelector((state)=>
    state.themeChange.Darkmood);
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<Loggedin/>}>
          <Route element={<RootLayout/>}>
          <Route path="/" element={<Home/>}>
          </Route>
          <Route path="/message" element={<Message/>}>
          </Route>
          <Route path="/accountinfo" element={<Accountinfo/>}>
          </Route>
       </Route>
         </Route>
        <Route element={<Notloggedin/>}>
        <Route path="/registration" element={<Registration />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgetpassword" element={<Forget/>}></Route>
        </Route>
      </Route>
    )
  );
  return (
    <>
    <div className={theme && "dark"}>
    <RouterProvider router={router}></RouterProvider>
    </div>
     

    </>
  );
  }

export default App;