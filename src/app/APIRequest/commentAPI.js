import axios from "axios";

const GET_COMMENTS = async(VlogID,ParentID,band)=>{
    try {
        const response = await axios.get('/api/getComment',{params:{VlogID,ParentID,band}});
        return response;
    } catch (error) {
        return error;
    }
}

const ADD_COMMENTS = async(VlogID,ParentID,Comment)=>{
    try {
        const response = await axios.post('/api/addComment',{VlogID,ParentID,Comment},{
            withCredentials: true
        });
        return response;
    } catch (error) {
        return error;
    }
}

const REMOVE_COMMENT = async(VlogID,ParentID,CommentID)=>{
    try {
        const response = await axios.delete('/api/removeComment',{
            params:{VlogID,ParentID,CommentID},
            withCredentials: true
        });
        return response;
    } catch (error) {
        return error;
    }
}

export {GET_COMMENTS,ADD_COMMENTS,REMOVE_COMMENT};

