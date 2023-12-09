import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: {
        id: "",
        name: "",
        email: "",
        avatar: "",
        teams: [],
        devices: [],
        role: "",
        login: false
        
    }
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setLogin(state, action) {
            console.log("action: ", action)
            const { email, id, avatar, name, role, teams, devices} = action.payload
            state.profile = {
                id,
                name,
                email,
                avatar,
                teams,
                devices,
                role,
                login: true
            }
        },
        setLogout(state){
            state.profile = initialState.profile
        }
    }
})

export const { setLogin, setLogout } = userSlice.actions

export default userSlice.reducer