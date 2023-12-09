import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import sidebarSlice from "./sidebarSlice";

const store = configureStore({
    reducer: {
        // key : value
        user: userSlice,
        sidebar: sidebarSlice
    },
});

export default store;