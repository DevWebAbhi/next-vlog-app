import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    textAiOutput:"",
    aiToolPrompt:"",
    loadingAI:false
}
export const aiSlice = createSlice({
    name:"aislice",
    initialState,
    reducers:{
        textAiOutput:(state,action)=>{
            state.textAiOutput = action.payload;
        },
        aiToolPrompt:(state,action)=>{
            state.aiToolPrompt = action.payload;
        },
        loadingAI:(state,action)=>{
            state.loadingAI = action.payload;
        },
    }
});

export const{textAiOutput,aiToolPrompt,loadingAI} = aiSlice.actions;

export default aiSlice.reducer;