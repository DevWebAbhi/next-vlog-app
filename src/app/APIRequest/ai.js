import axios from "axios";
async function aiOutputGenerator(prompt){
    try {
        const response  = await axios.get("/api/aiOutput",{params:{prompt}});
        console.log(response)
        return response;
    } catch (error) {
        return error;
    }
}

export {aiOutputGenerator}; 