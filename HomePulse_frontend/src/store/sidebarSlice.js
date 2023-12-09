import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   selectedPage: 1,
   toggle: false,
}
const sidebarSlice = createSlice({
    name: "sidebar",
    initialState: initialState,
    reducers: {
        setSelectedPage(state, action) {
            //console.log("sp action: ", action)
            const page = action.payload
            state.selectedPage = page
            
        },
        setToggle(state, action){
            state.toggle = action.payload
        }
    }
})

export const {setSelectedPage, setToggle} = sidebarSlice.actions
export default sidebarSlice.reducer