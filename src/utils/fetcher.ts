import axios from 'axios';

export const axiosFetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
};