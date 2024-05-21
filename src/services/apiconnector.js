// import axios from "axios"

// export const axiosInstance = axios.create({});

// export const apiconnector = (method, url, bodyData, headers, params) => {
//     return axiosInstance({
//         method:`${method}`,
//         url:`${url}`,
//         data: bodyData ? bodyData : null,
//         headers: headers ? headers: null,
//         params: params ? params : null,
//     });
// }
import axios from "axios";

export const axiosInstance = axios.create({});

export const apiconnector = async (method, url, bodyData, headers, params) => {
    try {
        const response = await axiosInstance({
            method: method,
            url: url,
            data: bodyData ? bodyData : null,
            headers: headers ? headers : null,
            params: params ? params : null,
        });
        return response.data;
    } catch (error) {
        // Handle the error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server responded with an error:", error.response.data);
            console.error("Status code:", error.response.status);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error("Error setting up the request:", error.message);
        }
        // Throw the error for further handling
        throw error;
    }
};
