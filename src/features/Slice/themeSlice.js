import { createSlice } from "@reduxjs/toolkit";
import { userSlice } from "./UserSlice";

export const themeSlice = createSlice({
   name:"Darkmood",
   initialState:{
    Darkmood: localStorage.getItem("mode") ? JSON.parse(localStorage.getItem("mode")) : false,
   },
   
   reducers : {
    Thememood :  (state,action) => {
        state.Darkmood = action.payload;
    },
   },
});

export const { Thememood } = themeSlice.actions;

export default themeSlice.reducer;