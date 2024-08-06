import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadingVlogs:false,
    vlogs:[],
    totalPage:1,
    currentPage:1,
    loadingCreateVlog:false,
    loadingAITilte:false,
    loadingAIDescription:false,
    loadingDeleteVlog:[],
    loadingAddLike:[],
    loadingAddComment:[],
    loadingMoreLike:[],
    loadingMoreComments:[],
    loadingDeleteLike:[[]],
    loadingDeleteComment:[[]],
    title:"",
    description:"",
    
}

export const vlogSlice = createSlice(
    {
        name:"vlogs",
        initialState,
        reducers:{
            loadingVlogs:(state,action)=>{
                state.loadingVlogs = action.payload
            },
            vlogs:(state,action)=>{
                state.vlogs = action.payload;
            },
            totalPage:(state,action)=>{
                state.totalPage = action.payload;
            },
            currentPage:(state,action)=>{
                state.currentPage = action.payload
            },
            loadingCreateVlog:(state,action)=>{
                state.loadingCreateVlog = action.payload
            },
            loadingAITilte:(state,action)=>{
                state.loadingAITilte=action.payload;
            },
            loadingAIDescription:(state,action)=>{
                state.loadingAIDescription=action.payload;
            },
            loadingDeleteVlog:(state,action)=>{
                state.loadingDeleteVlog=action.payload;
            },
            loadingDeleteComment:(state,action)=>{
                state.loadingDeleteComment=action.payload;
            },
            loadingDeleteLike:(state,action)=>{
                state.loadingDeleteLike=action.payload;
            },
            loadingAddComment:(state,action)=>{
                state.loadingAddComment=action.payload;
            },
            loadingAddLike:(state,action)=>{
                state.loadingAddLike=action.payload;
            },
            loadingMoreComments:(state,action)=>{
                state.loadingMoreComments = action.payload;
            },
            loadingMoreLike:(state,action)=>{
                state.loadingMoreLike = action.payload;
            },
            title:(state,action)=>{
                state.title = action.payload
            },
            description:(state,action)=>{
                state.description = action.payload
            },
            resetVlogs:(state,action)=>{
                 state=initialState
            }
        }
    }

)

export const {loadingVlogs,resetVlogs,vlogs,totalPage,currentPage,loadingCreateVlog,loadingAITilte,loadingAIDescription,loadingDeleteVlog,loadingDeleteComment,loadingDeleteLike,loadingAddComment,loadingAddLike,loadingMoreComments,loadingMoreLike,title,description} = vlogSlice.actions;

export default vlogSlice.reducer;