import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myloadingVlogs:false,
    myvlogs:[],
    mytotalPage:0,
    mycurrentPage:1,
    myloadingCreateVlog:false,
    myloadingAITilte:false,
    myloadingAIDescription:false,
    myloadingDeleteVlog:[],
    myloadingAddLike:[],
    myloadingAddComment:[],
    myloadingMoreLike:[],
    myloadingMoreComments:[],
    myloadingDeleteLike:[[]],
    myloadingDeleteComment:[[]],
    
}

export const myvlogSlice = createSlice(
    {
        name:"vlogs",
        initialState,
        reducers:{
            myloadingVlogs:(state,action)=>{
                state.myloadingVlogs = action.payload
            },
            myvlogs:(state,action)=>{
                state.myvlogs = action.payload;
                console.log(action.payload)
            },
            mytotalPage:(state,action)=>{
                state.mytotalPage = action.payload;
            },
            mycurrentPage:(state,action)=>{
                state.mycurrentPage = action.payload
            },
            myloadingCreateVlog:(state,action)=>{
                state.myloadingCreateVlog = action.payload
            },
            myloadingAITilte:(state,action)=>{
                state.myloadingAITilte=action.payload;
            },
            myloadingAIDescription:(state,action)=>{
                state.myloadingAIDescription=action.payload;
            },
            myloadingDeleteVlog:(state,action)=>{
                state.myloadingDeleteVlog=action.payload;
            },
            myloadingDeleteComment:(state,action)=>{
                state.myloadingDeleteComment=action.payload;
            },
            myloadingDeleteLike:(state,action)=>{
                state.myloadingDeleteLike=action.payload;
            },
            myloadingAddComment:(state,action)=>{
                state.myloadingAddComment=action.payload;
            },
            myloadingAddLike:(state,action)=>{
                state.myloadingAddComment=action.payload;
            },
            myloadingAddComment:(state,action)=>{
                state.myloadingAddLike=action.payload;
            },
            myloadingMoreComments:(state,action)=>{
                state.myloadingMoreComments = action.payload;
            },
            myloadingMoreLike:(state,action)=>{
                state.myloadingMoreLike = action.payload;
            },
            
        }
    }

)

export const {myloadingVlogs,myvlogs,mytotalPage,mycurrentPage,myloadingCreateVlog,myloadingAITilte,myloadingAIDescription,myloadingDeleteVlog,myloadingDeleteComment,myloadingDeleteLike,myloadingAddComment,myloadingAddLike,myloadingMoreComments,myloadingMoreLike} = myvlogSlice.actions;

export default myvlogSlice.reducer;