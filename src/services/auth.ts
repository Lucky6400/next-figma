import axios from 'axios'

export const signIn = async (payload: any) => {
    try {
        const res = await axios.post(`http://localhost:3000/api/users/signin`, payload);
        const data = await res.data;

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}