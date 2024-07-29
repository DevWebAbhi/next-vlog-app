// file: userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    signup:false,
    forgetPassword:false,
    forgetEmail:"",
    loginEmail:"",
    loginPassword:"",
    userName:"",
    signupEmail:"",
    signupPassword:"",
    resetPasswordEmail:"",
    resetPassword:"",
    confirmResetPassword:"",
    verificationEmail:"",
    verificationPassword:"",
    loading:false
}

export const userSlice = createSlice({
  name: 'userslice',
  initialState,
  reducers:{
    loginEmail:(state,action)=>{
        state.loginEmail = action.payload; 
    },
    signupEmail:(state,action)=>{
        state.signupEmail = action.payload; 
    },
    loginPassword:(state,action)=>{
        state.loginPassword = action.payload
    },
    signupPassword:(state,action)=>{
        state.signupPassword = action.payload
    },
    userName:(state,action)=>{
        state.userName = action.payload
    },
    changeSignup:(state,action)=>{
        state.signup = action.payload
    },
    forgetEmail:(state,action)=>{
        state.forgetEmail = action.payload;
    },
    forgetPassword:(state,action)=>{
        state.forgetPassword = action.payload
    },
    resetPasswordEmail:(state,action)=>{
        state.resetPasswordEmail = action.payload;
    },
    resetPassword:(state,action)=>{
        state.resetPassword = action.payload
    },
    confirmResetPassword:(state,action)=>{
        state.confirmResetPassword = action.payload
    },
    loading:(state,action)=>{
        state.loading = action.payload;
    },
    verificationEmail:(state,action)=>{
        state.verificationEmail = action.payload; 
    },
    verificationPassword:(state,action)=>{
        state.verificationPassword = action.payload; 
    },
    reset:(state,payload)=>{
        initialState
    }
  }
})
export const{loginEmail,loginPassword,verificationEmail,verificationPassword,resetPassword,resetPasswordEmail,loading,confirmResetPassword,signupEmail,signupPassword,userName,changeSignup,forgetPassword,forgetEmail,reset} = userSlice.actions;
export default userSlice.reducer