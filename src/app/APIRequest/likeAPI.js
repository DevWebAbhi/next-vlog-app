import axios from "axios";

const GET_LIKES = async(VlogID,ParentID,band)=>{
    try {
        const response = await axios.get('/api/getLikes',{params:{VlogID,ParentID,band}});
        return response;
    } catch (error) {
        return error;
    }
}

const ADD_LIKES = async(VlogID,ParentID)=>{
    try {
        const response = await axios.post('/api/addLike',{VlogID,ParentID},{
            withCredentials: true
        });
        return response;
    } catch (error) {
        return error;
    }
}

const REMOVE_LIKES = async(VlogID,ParentID)=>{
    try {
        const response = await axios.delete('/api/removeLike',{
            params:{VlogID,ParentID},
            withCredentials: true
        });
        return response;
    } catch (error) {
        return error;
    }
}

export {GET_LIKES,ADD_LIKES,REMOVE_LIKES};

