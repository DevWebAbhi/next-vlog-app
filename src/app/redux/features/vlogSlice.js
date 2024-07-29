import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadingVlogs:false,
    vlogButtonLoading:false,
    vlogs:[],
    individualVlogs:[],
    loadingIndividualVlogs:false,
    loadingCreateVlog:false,
    title:"",
    description:"",
    mediaTypes:[],
    singleVlog:{},
}

export const vlogSlice = createSlice(
    {
        name:"vlogs",
        initialState,
        reducers:{
            loadingVlogs:(state,action)=>{
                state.loadingVlogs = action.payload
            },
            vlogButtonLoading:(state,action)=>{
                state.vlogButtonLoading = action.payload
            },
            vlogs:(state,action)=>{
                state.vlogs = action.payload;
                console.log(action.payload)
            },
            mediaTypes:(state,action)=>{
                state.mediaTypes = action.payload;
            },
            singleVlog:(state,action)=>{
                state.singleVlog = action.payload
            },
            individualVlogs:(state,action)=>{
                state.individualVlogs = action.payload
            },
            loadingCreateVlog:(state,action)=>{
                state.loadingCreateVlog = action.payload
            },
            loadingIndividualVlogs:(state,action)=>{
                state.loadingIndividualVlogs = action.payload
            },
            title:(state,action)=>{
                state.title = action.payload
            },
            description:(state,action)=>{
                state.description = action.payload
            },
        }
    }

)

export const {vlogButtonLoading,loadingVlogs,vlogs,individualVlogs,loadingIndividualVlogs,loadingCreateVlog,description,title,mediaTypes,singleVlog} = vlogSlice.actions;

export default vlogSlice.reducer;