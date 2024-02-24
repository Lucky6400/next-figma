import axios, { AxiosError } from 'axios'

export const signIn = async (payload: any) => {
    try {
        const res = await axios.post(`/api/users/signin`, payload);
        const data = await res.data;

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const getCurrentUser = async () => {

    const res = await axios.get(`/api/users/getcurrent`);
    const data = await res.data;
    console.log(data)
    if (data.success) {
        return data.data;
    }

    return "Error"

}

export const updateUser = async (id: string, data: any) => {
    try {
        const res = await axios.put(`/api/users/${id}`, data);
        const resData = await res.data;
        if(resData.success) {
            return resData
        }
        return "Error";
    } catch (error) {
        return error;
    }
}