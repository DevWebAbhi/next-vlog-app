"use client"
import axios from "axios";


const BASE_URL = process.env.BASE_URL || "";
console.log(BASE_URL)
const GET_ALL_VLOGS = async (page) => {
    try {
        const response = await axios.get(`/api/getAllVlogs`, {
            params:{page},
            withCredentials: true,
        });
        return response;
    } catch (error) {
        return error;
    }
};

const GET_VLOGS = async (page) => {
    try {
        const response = await axios.get(`/api/getVlogs`,{
            params:{page},
            withCredentials: true,
        });
        return response;
    } catch (error) {
        return error;
    }
};

const CREATE_VLOG = async (data) => {
    try {
        const response = await axios.post(
            '/api/createVlog',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        );
        return response;
    } catch (error) {
        return error;
    }
};

const EDIT_VLOGS = async (VlogID,title,description) => {
    try {
        const response = await axios.put(`/api/editVlog`,{title,description}, {
            params:{VlogID},
            withCredentials: true,
        });
        return response;
    } catch (error) {
        return error;
    }
};

const DELETE_VLOGS = async (VlogID) => {
    try {
        const response = await axios.delete(`/api/removeVlog`, {
            params:{VlogID},
            withCredentials: true,
        });
        return response;
    } catch (error) {
        return error;
    }
};

export { GET_ALL_VLOGS,GET_VLOGS, CREATE_VLOG ,DELETE_VLOGS,EDIT_VLOGS};
