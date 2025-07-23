import { httpClient } from "../config/AxiosHealper"


// Create room api
export const createRoomApi = async (roomId) => {
    const response = await httpClient.post(`/api/v1/rooms`, roomId, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return response.data;
};


// Join room api 
export const joinChatApi = async (roomId) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
    return response.data
}


// Load Message API
export const getMessages = async (roomId, size=50, page=0) => {
    
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`);
    return response.data;
}