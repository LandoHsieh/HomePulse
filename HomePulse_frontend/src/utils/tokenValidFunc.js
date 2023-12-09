import { useQuery } from "@tanstack/react-query"
import axios from "axios"
const { VITE_BACKEND_HOST } = import.meta.env

const tokenValidFunc = async (accessToken) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['productDetail', id],
        queryFn: () => axios.get(url)
    })
    

    // try {
    //     const response = await axios.post(
    //         `${VITE_BACKEND_HOST}/api/1.0/user/token_validate`,
    //         {
    //             access_token: accessToken
    //         },
    //         {
    //             headers: {
    //                 "Content-Type": 'application/json'
    //             }
    //         }
    //     )
    //     return response.data
    // } catch (err) {
    //     return false
    // }
    
}

export default tokenValidFunc