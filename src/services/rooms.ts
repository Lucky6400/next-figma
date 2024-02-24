import axios from "axios";

export const getAllRooms = async () => {
    try {
        const res = await axios.get(`/api/rooms/all`);
        const data = await res.data;
        if(data.success) {
            return data.rooms.data;
        }
        return data;
    } catch (error) {
        return error;
    }
}

export const createRoom = async (id: string) => {
    try {
        const res = await axios.post(`/api/rooms/create`, {
            roomid: id
        });


        const data = await res.data;

        return data;
    } catch (error) {
        return error;
    }
}

export const deleteRoom = async (id: string) => {
    try {
        const res = await axios.delete(`/api/rooms/${id}`);
        const data = await res.data;
        return data;
    } catch (error) {
        return error;
    }
}