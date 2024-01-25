import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "../Slice/UserSlice";
import  activeChatSlice  from "../Slice/activeSingle";
import modeSlice from "../Slice/themeSlice"

const Store = configureStore({
    reducer:{
        loginSlice:authSlice,
        activeChat:activeChatSlice,
        themeChange: modeSlice,
    },
    
});

export default Store;