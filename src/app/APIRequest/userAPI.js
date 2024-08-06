"use client"
import axios from "axios"

const BASE_URL = process.env.BASE_URL;

async function SIGNUP(data){
    try {
        const response = await axios.post(`/api/signup`,data);
        return response;
    } catch (error) {
        return error;
    }
}

async function LOGIN (data){
    try {
        const response = await axios.post('/api/login',data);
        return response;
    } catch (error) {
        return error;
    }
}

async function FORGET_PASSWORD (data){
    try {
        const response = await axios.post('/api/forgetpassword',data);
        return response;
    } catch (error) {
        return error;
    }
}

async function RESET_PASSWORD (...data){
try {
    const response = await axios.post('/api/resetpassword',{email:data[0],newPassword:data[1],token:data[2]});
    return response;
} catch (error) {
    return error;
}
}

async function VERIFICATION (token,email,password){
    try {
        const response = await axios.post('/api/verification',{token,email,password});
        return response;
    } catch (error) {
        return error;
    }
}

export {SIGNUP,LOGIN,FORGET_PASSWORD,RESET_PASSWORD,VERIFICATION};